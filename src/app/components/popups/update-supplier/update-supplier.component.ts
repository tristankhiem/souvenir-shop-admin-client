import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {SupplierModel} from '../../../data-services/schema/supplier.model';
import {SupplierService} from '../../../services/store/supplier.service';

declare var $: any;

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html'
})

export class UpdateSupplierComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private supplierService: SupplierService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateSupplierModalWrapper', {static: true}) updateSupplierModalWrapper: ModalWrapperComponent;
  @ViewChild('updateSupplierForm', {static: true}) updateSupplierForm: NgForm;

  public supplier: SupplierModel = new SupplierModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateSupplierModalWrapper.id} .modal-dialog`);
  }

  public show(supplier: SupplierModel, event: Event): void {
    event.preventDefault();
    this.getSupplier(supplier.id);
    this.updateSupplierModalWrapper.show();

  }

  public hide(): void {
    this.updateSupplierForm.onReset();
    this.updateSupplierModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.supplier = new SupplierModel();
    this.updateSupplierForm.onReset();
  }

  private getSupplier(id: number): void{
    this.loading.show();
    this.supplierService.getById(id).subscribe(res => this.getSupplierCompleted(res));
  }

  private getSupplierCompleted(res: ResponseModel<SupplierModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.supplier = res.result;
  }

  public isValid(): boolean{
    if (this.updateSupplierForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveSupplier();
  }

  private saveSupplier(): void {
    this.loading.show(this.targetModalLoading);
    this.supplierService.update(this.supplier).subscribe(res => this.saveSupplierCompleted(res));
  }

  private saveSupplierCompleted(res: ResponseModel<SupplierModel>): void {
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
