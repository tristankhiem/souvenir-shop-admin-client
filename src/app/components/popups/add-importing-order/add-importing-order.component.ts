import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {SizeService} from '../../../services/store/size.service';
import {CategoryModel} from '../../../data-services/schema/category.model';
import {CategoryService} from '../../../services/store/category.service';
import {ImportingOrderModel} from '../../../data-services/schema/importing-order.model';
import {ImportingOrderService} from '../../../services/store/importing-order.service';
import {SupplierModel} from '../../../data-services/schema/supplier.model';
import {EmployeeModel} from '../../../data-services/schema/employee.model';

declare var $: any;

@Component({
  selector: 'app-add-importing-order',
  templateUrl: './add-importing-order.component.html'
})
export class AddImportingOrderComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private importingOrderService: ImportingOrderService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addImportingOrderModalWrapper', {static: true}) addImportingOrderModalWrapper: ModalWrapperComponent;
  @ViewChild('addImportingOrderForm', {static: true}) addImportingOrderForm: NgForm;

  public importingOrder: ImportingOrderModel = new ImportingOrderModel();
  public supplier: SupplierModel = new SupplierModel();
  public employee: EmployeeModel = new EmployeeModel();
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addImportingOrderModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.addImportingOrderModalWrapper.show();

  }

  public hide(): void {
    this.addImportingOrderForm.onReset();
    this.addImportingOrderModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.importingOrder = new ImportingOrderModel();
    this.addImportingOrderForm.onReset();
  }

  public isValid(): boolean {
    if (this.addImportingOrderForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveCategory();
  }

  private saveCategory(): void {
    this.loading.show(this.targetModalLoading);
    this.importingOrderService.save(this.importingOrder).subscribe(res => this.saveCategoryCompleted(res));
  }

  private saveCategoryCompleted(res: ResponseModel<CategoryModel>): void {
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
