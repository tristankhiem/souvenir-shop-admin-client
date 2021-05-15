import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HTTP_CODE_CONSTANT } from "src/app/constants/http-code.constant";
import { INPUT_PATTERN_CONSTANT } from "src/app/constants/input-pattern.constant";
import { ResponseModel } from "src/app/data-services/response.model";
import { CustomerModel } from "src/app/data-services/schema/customer.model";
import { CustomerService } from "src/app/services/store/customer.service";
import { AppLoading, AppAlert } from "src/app/utils";
import { AppCommon } from "src/app/utils/app-common";
import { ModalWrapperComponent } from "../../commons/modal-wrapper/modal-wrapper.component";

declare var $: any;

@Component({
    selector: 'app-update-customer',
    templateUrl: './update-customer.component.html'
})

export class UpdateCustomerComponent implements AfterViewInit{
    constructor(
        private loading: AppLoading,
        private alert: AppAlert,
        private common: AppCommon,
        private customerService: CustomerService
    ) {
    }

    @Output() saveCompleted = new EventEmitter<any>();
    @ViewChild('updateCustomerModalWrapper', {static: true}) updateCustomerModalWrapper: ModalWrapperComponent;
    @ViewChild('updateCustomerForm', {static: true}) updateCustomerForm: NgForm;

    public customer: CustomerModel = new CustomerModel();

    public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;
    public emailPattern = INPUT_PATTERN_CONSTANT.emailPattern;
    public phonePattern  = INPUT_PATTERN_CONSTANT.phonePattern;

    private targetModalLoading: ElementRef;

    ngAfterViewInit(): void {
        this.targetModalLoading = $(`#${this.updateCustomerModalWrapper.id} .modal-dialog`);
    }

    private onInit(): void{
        this.customer.birthDate = new Date().toString();
    }

    public show(customer: CustomerModel, event: Event): void {
        event.preventDefault();
        this.getCustomer(customer.id);
        this.updateCustomerModalWrapper.show();
    }

    public hide(): void {
        this.updateCustomerForm.onReset();
        this.updateCustomerModalWrapper.hide();
    }

    public onHideEvent(): void {
        this.customer = new CustomerModel();
        this.updateCustomerForm.onReset();
    }
    private getCustomer(id: number): void{
        this.loading.show();
        this.customerService.getById(id).subscribe(res => this.getCustomerCompleted(res));
    }

    private getCustomerCompleted(res: ResponseModel<CustomerModel>): void {
        this.loading.hide();
        if (res.status !== HTTP_CODE_CONSTANT.OK) {
            this.alert.errorMessages(res.message);
            return;
        }

        this.customer = res.result;
    }

    public isValid(): boolean{
        if (this.updateCustomerForm.invalid){
            return false;
        }

        return true;
    }

    public onSave(): void {
        if (!this.isValid()){
          return;
        }
        const currentDate = new Date(this.customer.birthDate);
        this.customer.birthDate = new Date(currentDate.getTime()).toDateString();

        this.saveCustomer();
    }

    private saveCustomer(): void {
        this.loading.show(this.targetModalLoading);
        this.customerService.update(this.customer).subscribe(res => this.saveCustomerCompleted(res));
    }

    private saveCustomerCompleted(res: ResponseModel<CustomerModel>): void {
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
