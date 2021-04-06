import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../../utils';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {ConstructionViolateService} from '../../../services/district/construction-violate.service';
import {ConstructionViolateModel} from '../../../data-services/construction-violate.model';
import {CurrentUserService} from '../../../services/district/current-user.service';
import {EMPLOYEE_GROUP_CONSTANT} from '../../../constants/employee-group.constant';
import {AppCommon} from '../../../utils/app-common';

@Component({
  selector: 'app-construction-violate-mgmt',
  templateUrl: './construction-violate-mgmt.component.html'
})
export class ConstructionViolateMgmtComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private modal: AppModals,
    private constructionViolateService: ConstructionViolateService,
    private currentUserService: CurrentUserService
  ) {
  }

  @ViewChild('dataTableConstructionViolate', {read: ElementRef}) dataTableConstructionViolate: ElementRef;

  public search: BaseSearchModel<ConstructionViolateModel[]> = new BaseSearchModel<ConstructionViolateModel[]>();

  ngOnInit(): void {
    this.getConstructionViolates();
  }

  public isEmployeeFromWard(): boolean {
    return this.common.toSlug(this.currentUserService.getEmployeeGroupName()) === EMPLOYEE_GROUP_CONSTANT.WARD_GROUP;
  }

  public onChangeDataEvent(search?: BaseSearchModel<ConstructionViolateModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getConstructionViolates();
  }

  public openCancelModal(constructionViolate: ConstructionViolateModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn huỷ hồ sơ ${constructionViolate.id}?`, 'Huỷ hồ sơ vi phạm', false)
      .subscribe(res => this.confirmCancelConstructionViolate(res, constructionViolate));
  }

  private getConstructionViolates(): void {
    this.loading.show();

    if (this.isEmployeeFromWard()) {
      this.constructionViolateService.findByWard(this.search, this.currentUserService.getWards()[0].id)
        .subscribe(res => this.getConstructionViolatesCompleted(res));
    } else {
      this.constructionViolateService.find(this.search).subscribe(res => this.getConstructionViolatesCompleted(res));
    }
  }

  private getConstructionViolatesCompleted(res: ResponseModel<BaseSearchModel<ConstructionViolateModel[]>>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  private confirmCancelConstructionViolate(state: boolean, constructionViolate: ConstructionViolateModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    // this.constructionViolateService.deleteEmployee(employee.id).subscribe(res => this.deleteConstructionViolateCompleted(res));
  }

  private deleteConstructionViolateCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
