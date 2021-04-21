import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {SupplierModel} from '../../../data-services/schema/supplier.model';
import {SupplierService} from "../../../services/store/supplier.service";

declare var $: any;

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html'
})

export class AddSupplierComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private supplierService: SupplierService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addSupplierModalWrapper', {static: true}) addSupplierModalWrapper: ModalWrapperComponent;
  @ViewChild('addSupplierForm', {static: true}) addSupplierForm: NgForm;

  public supplier: SupplierModel = new SupplierModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addSupplierModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.addSupplierModalWrapper.show();

  }

  public hide(): void {
    this.addSupplierForm.onReset();
    this.addSupplierModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.supplier = new SupplierModel();
    this.addSupplierForm.onReset();
  }

  public isValid(): boolean {
    if (this.addSupplierForm.invalid){
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
    this.supplierService.save(this.supplier).subscribe(res => this.saveSupplierCompleted(res));
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
