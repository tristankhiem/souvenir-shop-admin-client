import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../../../utils';
import {AppCommon} from '../../../../utils/app-common';
import {ActivatedRoute, Router} from '@angular/router';
import {ConstructionViolateService} from '../../../../services/district/construction-violate.service';
import {ViolateTypeService} from '../../../../services/district/violate-type.service';
import {WardService} from '../../../../services/district/ward.service';
import {CertificateService} from '../../../../services/district/certificate.service';
import {RoleService} from '../../../../services/district/role.service';
import {CurrentUserService} from '../../../../services/district/current-user.service';
import {NgForm} from '@angular/forms';
import {ViolateTypeModel} from '../../../../data-services/violate-type.model';
import {CertificateModel} from '../../../../data-services/certificate.model';
import {WardModel} from '../../../../data-services/ward.model';
import {ConstructionViolateModel} from '../../../../data-services/construction-violate.model';
import {INPUT_PATTERN_CONSTANT} from '../../../../constants/input-pattern.constant';
import {VIOLATE_STATUS_CONSTANT} from '../../../../constants/violate-status.constant';
import {ResponseModel} from '../../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../../constants/http-code.constant';
import {ID_PROVIDER_CONSTANT} from '../../../../constants/id-provider.constant';
import {ConstructionViolateFullModel} from '../../../../data-services/construction-violate-full.model';
import {ConstructionViolateDocumentModel} from '../../../../data-services/construction-violate-document.model';
import {EMPLOYEE_GROUP_CONSTANT} from '../../../../constants/employee-group.constant';
import {USER_PERMISSION_CODE} from '../../../../constants/user-permission.constant';

@Component({
  selector: 'app-construction-violate-update',
  templateUrl: './construction-violate-update.component.html'
})
export class ConstructionViolateUpdateComponent implements OnInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private common: AppCommon,
    private router: Router,
    private route: ActivatedRoute,
    private constructionViolateService: ConstructionViolateService,
    private violateTypeService: ViolateTypeService,
    private wardService: WardService,
    private certificateService: CertificateService,
    private roleService: RoleService,
    private currentUserService: CurrentUserService
  ) {
  }

  @ViewChild('updateConstructionViolateForm', {static: true}) updateConstructionViolateForm: NgForm;

  public violateTypes: ViolateTypeModel[] = [];
  public certificates: CertificateModel[] = [];
  public wards: WardModel[] = [];
  public idProvider: string[] = [];
  public hasReceipt = false;
  public tempReceipt = {
    violateReceiptId: '',
    violateReceiptDate: new Date().getTime()
  };

  public updatingConstructionViolate: ConstructionViolateFullModel = new ConstructionViolateFullModel();

  public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;

  private isLoaded = false;
  private countRequest: number;
  private targetModalLoading: ElementRef;

  ngOnInit(): void {
    this.onInit();
    this.loadData();
  }

  public onInit(): void {
    this.updatingConstructionViolate.ward.id = this.isEmployeeFromWard() ? this.currentUserService.getWards()[0].id : 0;
    this.updatingConstructionViolate.id = this.route.snapshot.params.violateId;

    this.updatingConstructionViolate.violateType.id = 0;
    this.updatingConstructionViolate.cardIdProvider = '0';
    this.updatingConstructionViolate.certificate.id = 0;
    this.updatingConstructionViolate.investorBirthDate = new Date().getTime();
    this.updatingConstructionViolate.investorCardDate = new Date().getTime();
    this.updatingConstructionViolate.wardDocumentCreatedDate = new Date().getTime();
    this.updatingConstructionViolate.violateDate = new Date().getTime();
    this.updatingConstructionViolate.certificateDate = new Date().getTime();
    this.updatingConstructionViolate.reportCreatedDate = new Date().getTime();
    this.updatingConstructionViolate.violateReceiptDate = new Date().getTime();
    this.updatingConstructionViolate.employeeRequest.id = this.currentUserService.getId();
    this.updatingConstructionViolate.employeeHandle.id = this.currentUserService.getId();
    this.updatingConstructionViolate.status = VIOLATE_STATUS_CONSTANT.SERVING;
  }

  public isEmployeeFromWard(): boolean {
    return this.common.toSlug(this.currentUserService.getEmployeeGroupName()) === EMPLOYEE_GROUP_CONSTANT.WARD_GROUP;
  }

  public hasManagementPermission(): boolean {
    return this.currentUserService.hasPermission(USER_PERMISSION_CODE.CONSTRUCTION_VIOLATE_MANAGEMENT);
  }

  public isWaitingStatus(): boolean {
    return this.updatingConstructionViolate.status === VIOLATE_STATUS_CONSTANT.WAITING;
  }

  public isCompletedStatus(): boolean {
    return this.updatingConstructionViolate.status === VIOLATE_STATUS_CONSTANT.COMPLETED;
  }

  public isCanceledStatus(): boolean {
    return this.updatingConstructionViolate.status === VIOLATE_STATUS_CONSTANT.CANCELED;
  }

  public isValid(): boolean {
    if (this.updateConstructionViolateForm.invalid) {
      return false;
    }

    if (this.updatingConstructionViolate.cardIdProvider === '0') {
      return false;
    }

    if (+this.updatingConstructionViolate.violateType.id === 0) {
      return false;
    }

    if (+this.updatingConstructionViolate.ward.id === 0) {
      return false;
    }

    if (+this.updatingConstructionViolate.certificate.id === 0) {
      return false;
    }
    return true;
  }

  public onUpdatingViolateDocument(updatingViolateDocuments: ConstructionViolateDocumentModel[]): void {
    this.updatingConstructionViolate.constructionViolateDocuments = updatingViolateDocuments.map(document => {
      return new ConstructionViolateDocumentModel(document);
    });
  }

  public onAddViolateOtherDocument(updatingViolateDocuments: ConstructionViolateDocumentModel[]): void {
    this.updatingConstructionViolate.constructionViolateDocuments = updatingViolateDocuments.map(document => {
      return new ConstructionViolateDocumentModel(document);
    });
  }

  public onSave(): void {
    if (!this.isValid()) {
      return;
    }
    this.saveConstructionViolate();
  }

  public saveConstructionViolateStatus(event: Event, status: number): void {
    event.preventDefault();
    event.stopPropagation();
    let confirmMessage: string;
    let confirmTitle: string;
    let tempStatus: string;
    if (status === 1) {
      confirmMessage = 'Xác nhận thụ lý yêu cầu xử phạt vi phạm hành chính số ' + this.updatingConstructionViolate.id + '?';
      confirmTitle = 'Xác nhận thụ lý yêu cầu xử phạt';
      tempStatus = VIOLATE_STATUS_CONSTANT.SERVING;
    }
    if (status === 0) {
      confirmMessage = 'Xác nhận kết hồ sơ vi phạm hành chính số ' + this.updatingConstructionViolate.id + '?';
      confirmTitle = 'Xác nhận kết hồ sơ';
      tempStatus = VIOLATE_STATUS_CONSTANT.COMPLETED;
    }
    if (status === -1) {
      confirmMessage = 'Xác nhận huỷ hồ sơ vi phạm hành chính số ' + this.updatingConstructionViolate.id + '?';
      confirmTitle = 'Xác nhận huỷ hồ sơ';
      tempStatus = VIOLATE_STATUS_CONSTANT.CANCELED;
    }

    this.modal.confirm(confirmMessage, confirmTitle, false)
      .subscribe(
        (state: boolean) => {
          if (!state) {
            return;
          }
          this.updatingConstructionViolate.status = tempStatus;
          this.loading.show(this.targetModalLoading);
          this.constructionViolateService.updateStatus(this.updatingConstructionViolate)
            .subscribe(res => this.saveConstructionViolateCompleted(res));
        });
  }

  private loadData(): void {
    this.loading.show();
    this.countRequest = 4;
    this.getViolateTypes();
    this.getCertificates();
    this.getIdProviders();
    this.getConstructionViolate();

    this.wards = this.currentUserService.getWards();
  }

  private loadDataCompleted(): void {
    --this.countRequest;
    if (this.countRequest === 0) {
      this.isLoaded = true;
      this.loading.hide();
    }
  }

  private getConstructionViolate(): void {
    this.constructionViolateService.getConstructionViolate(this.updatingConstructionViolate.id)
      .subscribe(res => this.getConstructionViolateCompleted(res));
  }

  private getConstructionViolateCompleted(res: ResponseModel<ConstructionViolateFullModel>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.updatingConstructionViolate = res.result;
    this.tempReceipt.violateReceiptId = this.updatingConstructionViolate.violateReceiptId;
    this.tempReceipt.violateReceiptDate = this.updatingConstructionViolate.violateReceiptDate;

    if (this.updatingConstructionViolate.violateReceiptId) {
      this.hasReceipt = true;
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
    this.modal.confirm('Xác nhận cập nhật hồ sơ vi phạm số ' + this.updatingConstructionViolate.id + '?', 'Xác nhận cập nhật hồ sơ', false)
      .subscribe(
        (state: boolean) => {
          if (!state) {
            return;
          }
          this.loading.show(this.targetModalLoading);
          if (this.updatingConstructionViolate.violateReceiptId == null) {
            this.updatingConstructionViolate.violateReceiptDate = null;
          } else {
            if (this.updatingConstructionViolate.violateReceiptId.trim() === '') {
              this.updatingConstructionViolate.violateReceiptId = null;
              this.updatingConstructionViolate.violateReceiptDate = null;
            }
          }

          if (this.hasReceipt) {
            this.updatingConstructionViolate.violateReceiptId = this.tempReceipt.violateReceiptId;
            this.updatingConstructionViolate.violateReceiptDate = this.tempReceipt.violateReceiptDate;
          }
          this.constructionViolateService.update(this.updatingConstructionViolate)
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
