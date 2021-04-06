import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../../utils';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {CustomerGroupModel} from '../../../data-services/customer-group.model';
import {CustomerGroupService} from '../../../services/customer/customer-group.service';

@Component({
  selector: 'app-customer-group-mgmt',
  templateUrl: './customer-group-mgmt.component.html'
})
export class CustomerGroupMgmtComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private customerGroupService: CustomerGroupService
  ){}

  @ViewChild('dataTableCustomerGroup', {read: ElementRef}) dataTableCustomerGroup: ElementRef;

  public search: BaseSearchModel<CustomerGroupModel[]> = new BaseSearchModel<CustomerGroupModel[]>();

  ngOnInit(): void {
    this.getCustomerGroup();
  }

  public onChangeDataEvent(search?: BaseSearchModel<CustomerGroupModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getCustomerGroup(this.dataTableCustomerGroup.nativeElement);
  }

  private getCustomerGroup(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.customerGroupService.find(this.search).subscribe(res => this.getCustomerGroupCompleted(res, targetLoading));
  }

  private getCustomerGroupCompleted(res: ResponseModel<BaseSearchModel<CustomerGroupModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(customerGroup: CustomerGroupModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa nhóm khách hàng "${customerGroup.name}"?`, 'Xóa nhóm khách hàng', true)
      .subscribe(res => this.confirmDeleteCustomerGroup(res, customerGroup));
  }

  private confirmDeleteCustomerGroup(state: boolean, customerGroup: CustomerGroupModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.customerGroupService.deleteCustomerGroup(customerGroup.id).subscribe(res => this.deleteCustomerGroupCompleted(res));
  }

  private deleteCustomerGroupCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
