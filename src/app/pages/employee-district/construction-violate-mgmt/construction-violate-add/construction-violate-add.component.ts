import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {WardModel} from '../../../../data-services/ward.model';
import {CertificateModel} from '../../../../data-services/certificate.model';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../../constants/http-code.constant';
import {AppAlert, AppLoading, AppModals} from '../../../../utils';
import {WardService} from '../../../../services/district/ward.service';
import {CurrentUserService} from '../../../../services/district/current-user.service';
import {AppCommon} from '../../../../utils/app-common';
import {ConstructionViolateService} from '../../../../services/district/construction-violate.service';
import {ViolateTypeService} from '../../../../services/district/violate-type.service';
import {RoleService} from '../../../../services/district/role.service';
import {ModalWrapperComponent} from '../../../../components/commons/modal-wrapper/modal-wrapper.component';
import {ViolateTypeModel} from '../../../../data-services/violate-type.model';
import {ConstructionViolateModel} from '../../../../data-services/construction-violate.model';
import {INPUT_PATTERN_CONSTANT} from '../../../../constants/input-pattern.constant';
import {ID_PROVIDER_CONSTANT} from '../../../../constants/id-provider.constant';
import {VIOLATE_STATUS_CONSTANT} from '../../../../constants/violate-status.constant';
import {CertificateService} from '../../../../services/district/certificate.service';
import {Router} from '@angular/router';
import {EMPLOYEE_GROUP_CONSTANT} from '../../../../constants/employee-group.constant';

@Component({
  selector: 'app-construction-violate-add',
  templateUrl: './construction-violate-add.component.html'
})
export class ConstructionViolateAddComponent implements OnInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private common: AppCommon,
    private router: Router,
    private constructionViolateService: ConstructionViolateService,
    private violateTypeService: ViolateTypeService,
    private wardService: WardService,
    private certificateService: CertificateService,
    private roleService: RoleService,
    private currentUserService: CurrentUserService
  ) {
  }

  @ViewChild('addConstructionViolateForm', {static: true}) addConstructionViolateForm: NgForm;

  public violateTypes: ViolateTypeModel[] = [];
  public certificates: CertificateModel[] = [];
  public wards: WardModel[] = [];
  public idProvider: string[] = [];
  public hasReceipt = false;
  public newConstructionViolate: ConstructionViolateModel = new ConstructionViolateModel();

  public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;

  private isLoaded = false;
  private countRequest: number;
  private targetModalLoading: ElementRef;

  ngOnInit(): void {
    this.onInit();
    this.loadData();
  }

  public onInit(): void {
    this.newConstructionViolate.ward.id = this.isEmployeeFromWard() ? this.currentUserService.getWards()[0].id : 0;
    this.newConstructionViolate.violateType.id = 0;
    this.newConstructionViolate.cardIdProvider = '0';
    this.newConstructionViolate.certificate.id = 0;
    this.newConstructionViolate.investorBirthDate = new Date().getTime();
    this.newConstructionViolate.investorCardDate = new Date().getTime();
    this.newConstructionViolate.wardDocumentCreatedDate = new Date().getTime();
    this.newConstructionViolate.violateDate = new Date().getTime();
    this.newConstructionViolate.certificateDate = new Date().getTime();
    this.newConstructionViolate.reportCreatedDate = new Date().getTime();
    this.newConstructionViolate.violateReceiptDate = new Date().getTime();
    this.newConstructionViolate.employeeRequest.id = this.currentUserService.getId();
    if (!this.isEmployeeFromWard()){
      this.newConstructionViolate.employeeHandle.id = this.currentUserService.getId();
      this.newConstructionViolate.status = VIOLATE_STATUS_CONSTANT.SERVING;
    } else {
      this.newConstructionViolate.employeeHandle = null;
      this.newConstructionViolate.status = VIOLATE_STATUS_CONSTANT.WAITING;
    }
  }

  public isEmployeeFromWard(): boolean {
    return this.common.toSlug(this.currentUserService.getEmployeeGroupName()) === EMPLOYEE_GROUP_CONSTANT.WARD_GROUP;
  }

  public isValid(): boolean {
    if (this.addConstructionViolateForm.invalid) {
      return false;
    }

    if (this.newConstructionViolate.cardIdProvider === '0') {
      return false;
    }

    if (+this.newConstructionViolate.violateType.id === 0) {
      return false;
    }

    if (+this.newConstructionViolate.ward.id === 0) {
      return false;
    }

    if (+this.newConstructionViolate.certificate.id === 0) {
      return false;
    }
    return true;
  }

  public onSave(): void {
    if (!this.isValid()) {
      return;
    }
    this.saveConstructionViolate();
  }

  private loadData(): void {
    this.loading.show();
    this.countRequest = 3;
    this.getViolateTypes();
    this.getCertificates();
    this.getIdProviders();

    this.wards = this.currentUserService.getWards();
  }

  private loadDataCompleted(): void {
    --this.countRequest;
    if (this.countRequest === 0) {
      this.isLoaded = true;
      this.loading.hide();
    }
  }

  private getViolateTypes(): void {
    this.violateTypeService.findAll().subscribe(res => this.getViolateTypesCompleted(res));
  }

  private getViolateTypesCompleted(res: ResponseModel<ViolateTypeModel[]>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.violateTypes = res.result;
  }

  private getIdProviders(): void {
    this.loadDataCompleted();
    this.idProvider.push(ID_PROVIDER_CONSTANT.POLICE_PROVIDER);
    this.idProvider.push(ID_PROVIDER_CONSTANT.IMMIGRATION_PROVIDER);
  }

  private getCertificates(): void {
    this.certificateService.findAll().subscribe(res => this.getCertificatesCompleted(res));
  }

  private getCertificatesCompleted(res: ResponseModel<CertificateModel[]>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.certificates = res.result;
  }

  private saveConstructionViolate(): void {
    this.modal.confirm('Xác nhận tạo hồ sơ vi phạm?', 'Xác nhận tạo hồ sơ vi phạm', false)
      .subscribe(
        (state: boolean) => {
          if (!state) {
            return;
          }
          this.loading.show(this.targetModalLoading);
          if (this.newConstructionViolate.violateReceiptId == null) {
            this.newConstructionViolate.violateReceiptDate = null;
          } else {
            if (this.newConstructionViolate.violateReceiptId.trim() === '') {
              this.newConstructionViolate.violateReceiptId = null;
              this.newConstructionViolate.violateReceiptDate = null;
            }
          }

          if (!this.hasReceipt) {
            this.newConstructionViolate.violateReceiptId = null;
            this.newConstructionViolate.violateReceiptDate = null;
          }

          this.constructionViolateService.save(this.newConstructionViolate)
            .subscribe(res => this.saveConstructionViolateCompleted(res));
        });
  }

  private saveConstructionViolateCompleted(res: ResponseModel<ConstructionViolateModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.router.navigateByUrl('/quan-ly-vi-pham-xay-dung');
  }
}
