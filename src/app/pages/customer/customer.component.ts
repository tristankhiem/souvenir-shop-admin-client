import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HTTP_CODE_CONSTANT } from 'src/app/constants/http-code.constant';
import { ResponseModel } from 'src/app/data-services/response.model';
import { CustomerModel } from 'src/app/data-services/schema/customer.model';
import { BaseSearchModel } from 'src/app/data-services/search/base-search.model';
import { CustomerService } from 'src/app/services/store/customer.service';
import { AppAlert, AppLoading, AppModals } from 'src/app/utils';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html'
})

export class CustomerComponent implements OnInit {
    constructor(
        private root: ElementRef,
        private customerService: CustomerService,
        private loading: AppLoading,
        private alert: AppAlert,
        private modal: AppModals
    ){}

    @ViewChild('dataTableCustomer', {read: ElementRef}) dataTableCustomer: ElementRef;

    public search: BaseSearchModel<CustomerModel[]> = new BaseSearchModel<CustomerModel[]>();

    ngOnInit(): void {
        this.getCustomers();
    }

    public onChangeDataEvent(search?: BaseSearchModel<CustomerModel[]>): void{
        if (search){
            this.search = search;
        }

        this.getCustomers(this.dataTableCustomer.nativeElement);
    }

    public openDeleteModal(customer: CustomerModel, event: Event): void {
        event.preventDefault();
        this.modal.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${customer.name}?`, 'Xóa tài khoản khách hàng', true)
          .subscribe(res => this.confirmDeleteCustomer(res, customer));
    }

    private getCustomers(targetLoading?: ElementRef): void {
        this.loading.show(targetLoading);
        this.customerService.search(this.search).subscribe( res =>  this.getCustomersCompleted(res, targetLoading));
    }

    private getCustomersCompleted(res: ResponseModel<BaseSearchModel<CustomerModel[]>>, targetLoading: ElementRef): void {
        this.loading.hide(targetLoading);
        if (res.status !== HTTP_CODE_CONSTANT.OK) {
          this.alert.errorMessages(res.message);
        }

        this.search = res.result;
    }

    private confirmDeleteCustomer(state: boolean, customer: CustomerModel): void {
        if (!state) {
            return;
        }

        this.loading.show();
        this.customerService.deleteCustomer(customer.id).subscribe(res => this.deleteCustomerCompleted(res));
    }

    private deleteCustomerCompleted(res: ResponseModel<any>): void {
        this.loading.hide();
        if (res.status !== HTTP_CODE_CONSTANT.OK) {
          this.alert.errorMessages(res.message);
          return;
        }

        this.alert.successMessages(res.message);
        this.onChangeDataEvent();
    }

    public changeAccountState(customer: CustomerModel): void{
        // event.preventDefault();
        this.loading.show();
        this.customerService.changeAccountState(customer).subscribe(res => this.changeAccountStateCompleted(res));
    }

    private changeAccountStateCompleted(res: ResponseModel<any>): void{
        this.loading.hide();
        if (res.status !== HTTP_CODE_CONSTANT.OK){
            this.alert.errorMessages(res.message);
            return;
        }

        this.alert.successMessages(res.message);
        this.onChangeDataEvent();
    }
}

