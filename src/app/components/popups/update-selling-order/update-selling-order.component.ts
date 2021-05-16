import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {CategoryModel} from '../../../data-services/schema/category.model';
import {SellingOrderService} from '../../../services/store/selling-order.service';
import {SellingOrderFullModel} from '../../../data-services/schema/selling-order-full.model';
import {SellingOrderModel} from '../../../data-services/schema/selling-order.model';

declare var $: any;

@Component({
  selector: 'app-update-selling-order',
  templateUrl: './update-selling-order.component.html'
})
export class UpdateSellingOrderComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private sellingOrderService: SellingOrderService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateSellingOrderModalWrapper', {static: true}) updateSellingOrderModalWrapper: ModalWrapperComponent;
  @ViewChild('updateSellingOrderForm', {static: true}) updateSellingOrderForm: NgForm;

  public sellingOrder: SellingOrderFullModel = new SellingOrderFullModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateSellingOrderModalWrapper.id} .modal-dialog`);
  }

  public show(sellingOrderModel: SellingOrderModel, event: Event): void {
    event.preventDefault();
    this.getSellingOrder(sellingOrderModel.id);
    this.updateSellingOrderModalWrapper.show();

  }

  public hide(): void {
    this.updateSellingOrderForm.onReset();
    this.updateSellingOrderModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.sellingOrder = new SellingOrderFullModel();
    this.updateSellingOrderForm.onReset();
  }

  public getTotal(): number {
    let total = 0;
    for (const i of this.sellingOrder.sellingTransactions) {
      total += i.quantity * i.price;
    }
    return total;
  }

  private getSellingOrder(id: number): void{
    this.loading.show();
    this.sellingOrderService.getById(id).subscribe(res => this.getSellingOrderCompleted(res));
  }

  private getSellingOrderCompleted(res: ResponseModel<SellingOrderFullModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.sellingOrder = res.result;
  }

  public isValid(): boolean{
    if (this.updateSellingOrderForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    let currentDate = new Date(this.sellingOrder.invoiceDate);
    this.sellingOrder.invoiceDate = new Date(currentDate.getTime()).toDateString();
    currentDate = new Date(this.sellingOrder.deliveryDate);
    this.sellingOrder.deliveryDate = new Date(currentDate.getTime()).toDateString();
    this.saveSellingOrder();
  }

  private saveSellingOrder(): void {
    this.loading.show(this.targetModalLoading);
    this.sellingOrderService.update(this.sellingOrder).subscribe(res => this.saveSellingOrderCompleted(res));
  }

  private saveSellingOrderCompleted(res: ResponseModel<SellingOrderFullModel>): void {
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
