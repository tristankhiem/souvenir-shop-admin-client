import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../../utils';
import {BaseSearchModel} from '../../../data-services/search/base-search.model';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {CustomerService} from '../../../services/customer/customer.service';
import {CustomerModel} from '../../../data-services/customer.model';

@Component({
  selector: 'app-customer-mgmt',
  templateUrl: './customer-mgmt.component.html'
})
export class CustomerMgmtComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private customerService: CustomerService
  ) {
  }

  @ViewChild('dataTableCustomer', {read: ElementRef}) dataTableCustomer: ElementRef;

  public search: BaseSearchModel<CustomerModel[]> = new BaseSearchModel<CustomerModel[]>();

  ngOnInit(): void {
    this.getCustomer();
  }

  public onChangeDataEvent(search?: BaseSearchModel<CustomerModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getCustomer(this.dataTableCustomer.nativeElement);
  }

  private getCustomer(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.customerService.find(this.search).subscribe(res => this.getCustomerCompleted(res, targetLoading));
  }

  private getCustomerCompleted(res: ResponseModel<BaseSearchModel<CustomerModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openUpdateStatusModal(customer: CustomerModel, event: Event, isLock: boolean): void {
    event.preventDefault();
    if (isLock === true){
      this.modal.confirm(`Bạn có chắc chắn muốn khóa tài khoản: "${customer.email}"?`, 'Khóa tài khoản khách hàng', false)
        .subscribe(res => this.confirmUpdateStatusCustomer(res, customer, isLock));
    } else {
      this.modal.confirm(`Bạn có chắc chắn muốn mở khóa tài khoản: "${customer.email}"?`, 'Mở khóa tài khoản khách hàng', false)
        .subscribe(res => this.confirmUpdateStatusCustomer(res, customer, isLock));
    }
  }

  private confirmUpdateStatusCustomer(state: boolean, customer: CustomerModel, isLock: boolean): void {
    if (!state) {
      return;
    }

    this.loading.show();
    if (isLock === true) {
      this.customerService.lockCustomer(customer.id).subscribe(res => this.updateStatusCustomerCompleted(res));
    } else {
      this.customerService.unlockCustomer(customer.id).subscribe(res => this.updateStatusCustomerCompleted(res));
    }
  }

  private updateStatusCustomerCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
