import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {ImportingOrderService} from '../../../services/store/importing-order.service';
import {SupplierModel} from '../../../data-services/schema/supplier.model';
import {EmployeeModel} from '../../../data-services/schema/employee.model';
import {ImportingOrderFullModel} from '../../../data-services/schema/importing-order-full.model';
import {SupplierService} from '../../../services/store/supplier.service';
import {ProductDetailModel} from '../../../data-services/schema/product-detail.model';
import {ProductDetailService} from '../../../services/store/product-detail.service';
import {ImportingTransactionModel} from '../../../data-services/schema/importing-transaction.model';

declare var $: any;

@Component({
  selector: 'app-update-importing-order',
  templateUrl: './update-importing-order.component.html'
})
export class UpdateImportingOrderComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private importingOrderService: ImportingOrderService,
    private supplierService: SupplierService,
    private productDetailService: ProductDetailService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateImportingOrderModalWrapper', {static: true}) updateImportingOrderModalWrapper: ModalWrapperComponent;
  @ViewChild('updateImportingOrderForm', {static: true}) updateImportingOrderForm: NgForm;

  public importingOrder: ImportingOrderFullModel = new ImportingOrderFullModel();
  public supplier: SupplierModel = new SupplierModel();
  public supplierResult: SupplierModel[] = [];
  public productDetail: ProductDetailModel = new ProductDetailModel();
  public productDetailResult: ProductDetailModel[] = [];
  public employee: EmployeeModel = new EmployeeModel();
  public transactionSelected: ImportingTransactionModel = new ImportingTransactionModel();
  public updateMode: boolean;
  public indexSelected: number;

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateImportingOrderModalWrapper.id} .modal-dialog`);
  }

  public show(importingOrder: ImportingOrderFullModel, event: Event): void {
    event.preventDefault();
    this.getImportingOrder(importingOrder.id);
    this.updateImportingOrderModalWrapper.show();
  }

  public hide(): void {
    this.updateImportingOrderForm.onReset();
    this.updateImportingOrderModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.importingOrder = new ImportingOrderFullModel();
    this.updateImportingOrderForm.onReset();
  }

  public isValid(): boolean {
    if (this.updateImportingOrderForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveImport();
  }

  public selectSupplier(): void {
    this.importingOrder.supplier = new SupplierModel(this.supplier);
  }

  public searchSuppliers(event): void {
    this.loading.show(this.targetModalLoading);
    this.supplierService.getLikeName(event.query).subscribe(res => this.searchSupplierCompleted(res));
  }

  private searchSupplierCompleted(res: ResponseModel<SupplierModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.supplierResult = res.result || [];
  }

  public searchProductDetails(event): void {
    this.loading.show(this.targetModalLoading);
    this.productDetailService.getLikeName(event.query).subscribe(res => this.searchProductDetailCompleted(res));
  }

  public selectProduct(): void {
    this.transactionSelected.productDetail = new ProductDetailModel(this.productDetail);
    this.transactionSelected.price = this.productDetail.importingPrice;
  }

  private searchProductDetailCompleted(res: ResponseModel<ProductDetailModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.productDetailResult = res.result || [];
  }

  public saveTransaction(): void {
    if (this.updateMode) {
      this.importingOrder.importingTransactions[this.indexSelected] = new ImportingTransactionModel(this.transactionSelected);
    } else {
      this.importingOrder.importingTransactions.push(this.transactionSelected);
    }
    this.cancelTransaction();
  }

  public selectTransaction(index: number): void {
    this.updateMode = true;
    this.indexSelected = index;
    this.transactionSelected = new ImportingTransactionModel(this.importingOrder.importingTransactions[index]);
    this.productDetail = new ProductDetailModel(this.transactionSelected.productDetail);
  }

  public cancelTransaction(): void {
    this.updateMode = false;
    this.transactionSelected = new ImportingTransactionModel();
    this.productDetail = new ProductDetailModel();
    this.productDetailResult = [];
  }

  public deleteTransaction(index: number): void {
    this.importingOrder.importingTransactions.splice(index, 1);
  }

  private saveImport(): void {
    this.loading.show(this.targetModalLoading);
    this.importingOrderService.update(this.importingOrder).subscribe(res => this.saveImportCompleted(res));
  }

  private saveImportCompleted(res: ResponseModel<ImportingOrderFullModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.saveCompleted.emit();
    this.hide();
  }

  public getTotal(): number {
    let total = 0;
    for (const i of this.importingOrder.importingTransactions) {
      total += i.quantity * i.price;
    }
    return total;
  }

  private getImportingOrder(id: number): void {
    this.loading.show();
    this.importingOrderService.getById(id).subscribe(res => this.getImportingOrderCompleted(res));
  }

  private getImportingOrderCompleted(res: ResponseModel<ImportingOrderFullModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }
    this.importingOrder = res.result;
    this.supplier = this.importingOrder.supplier;
  }
}
