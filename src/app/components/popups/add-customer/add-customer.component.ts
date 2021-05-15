import { ElementRef } from '@angular/core';
import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HTTP_CODE_CONSTANT } from 'src/app/constants/http-code.constant';
import { INPUT_PATTERN_CONSTANT } from 'src/app/constants/input-pattern.constant';
import { ResponseModel } from 'src/app/data-services/response.model';
import { CustomerModel } from 'src/app/data-services/schema/customer.model';
import { CustomerService } from 'src/app/services/store/customer.service';
import { AppLoading, AppAlert } from 'src/app/utils';
import { AppCommon } from 'src/app/utils/app-common';
import { ModalWrapperComponent } from '../../commons/modal-wrapper/modal-wrapper.component';

declare var $: any;

@Component({
    selector: 'app-add-customer',
    templateUrl: './add-customer.component.html'
})

export class AddCustomerComponent implements AfterViewInit{
    constructor(
        private loading: AppLoading,
        private alert: AppAlert,
        private common: AppCommon,
        private customerService: CustomerService
    ) {
    }

    @Output() saveCompleted = new EventEmitter<any>();
    @ViewChild('addCustomerModalWrapper', {static: true}) addCustomerModalWrapper: ModalWrapperComponent;
    @ViewChild('addCustomerForm', {static: true}) addCustomerForm: NgForm;

    public newCustomer: CustomerModel = new CustomerModel();

    public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;
    public emailPattern = INPUT_PATTERN_CONSTANT.emailPattern;
    public phonePattern  = INPUT_PATTERN_CONSTANT.phonePattern;

    private targetModalLoading: ElementRef;

    ngAfterViewInit(): void {
        this.targetModalLoading = $(`#${this.addCustomerModalWrapper.id} .modal-dialog`);
    }

    private onInit(): void {
        this.newCustomer.birthDate = new Date().toDateString();
    }

    public show(): void {
        this.onInit();
        this.addCustomerModalWrapper.show();
    }

    public hide(): void {
        this.addCustomerModalWrapper.hide();
    }

    public onHideEvent(): void {
        this.newCustomer = new CustomerModel();
        this.addCustomerForm.onReset();
    }

    public isValid(): boolean {
        if (this.addCustomerForm.invalid){
            return false;
        }

        return true;
    }

    public onSave(): void {
        if (!this.isValid()) {
          return;
        }
        const currentDate = new Date(this.newCustomer.birthDate);
        this.newCustomer.birthDate = new Date(currentDate.getTime()).toDateString();

        this.saveCustomer();
    }

    private saveCustomer(): void {
        this.loading.show(this.targetModalLoading);

        this.customerService.save(this.newCustomer).subscribe(res => this.saveEmployeeCompleted(res));
    }

    private saveEmployeeCompleted(res: ResponseModel<CustomerModel>): void {
        this.loading.hide(this.targetModalLoading);
        if (res.status !== HTTP_CODE_CONSTANT.OK) {
            this.alert.errorMessages(res.message);
            return;
        }

        this.alert.successMessages(res.message);
        this.saveCompleted.emit();
        this.hide();
    }

}
