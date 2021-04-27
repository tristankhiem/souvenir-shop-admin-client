import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ImportingOrderService} from '../../services/store/importing-order.service';
import {ImportingOrderModel} from '../../data-services/schema/importing-order.model';

@Component({
  selector: 'app-importing-order',
  templateUrl: './importing-order.component.html'
})
export class ImportingOrderComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private importingOrderService: ImportingOrderService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<ImportingOrderModel[]> = new BaseSearchModel<ImportingOrderModel[]>();

  ngOnInit(): void {
    this.getImportingOrder();
  }

  public onChangeDataEvent(search?: BaseSearchModel<ImportingOrderModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getImportingOrder(this.dataTableSize.nativeElement);
  }

  private getImportingOrder(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.importingOrderService.search(this.search).subscribe(res => this.getImportingOrderCompleted(res, targetLoading));
  }

  private getImportingOrderCompleted(res: ResponseModel<BaseSearchModel<ImportingOrderModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(importingOrder: ImportingOrderModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa phiếu nhập?`, 'Xóa phiếu nhập', true)
      .subscribe(res => this.confirmDeleteImportingOrder(res, importingOrder));
  }

  private confirmDeleteImportingOrder(state: boolean, importingOrder: ImportingOrderModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.importingOrderService.deleteImportingOrder(importingOrder.id).subscribe(res => this.deleteImportingOrderCompleted(res));
  }

  private deleteImportingOrderCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
