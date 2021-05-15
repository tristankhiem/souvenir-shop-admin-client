import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ImportingOrderService} from '../../services/store/importing-order.service';
import {ImportingOrderModel} from '../../data-services/schema/importing-order.model';
import {SellingOrderService} from '../../services/store/selling-order.service';
import {SellingOrderModel} from '../../data-services/schema/selling-order.model';

@Component({
  selector: 'app-selling-order',
  templateUrl: './selling-order.component.html'
})
export class SellingOrderComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private sellingOrderService: SellingOrderService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<SellingOrderModel[]> = new BaseSearchModel<SellingOrderModel[]>();

  ngOnInit(): void {
    this.getSellingOrder();
  }

  public onChangeDataEvent(search?: BaseSearchModel<SellingOrderModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getSellingOrder(this.dataTableSize.nativeElement);
  }

  private getSellingOrder(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.sellingOrderService.search(this.search).subscribe(res => this.getSellingOrderCompleted(res, targetLoading));
  }

  private getSellingOrderCompleted(res: ResponseModel<BaseSearchModel<SellingOrderModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(sellingOrder: SellingOrderModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa phiếu nhập?`, 'Xóa phiếu nhập', true)
      .subscribe(res => this.confirmDeleteSellingOrder(res, sellingOrder));
  }

  private confirmDeleteSellingOrder(state: boolean, sellingOrder: SellingOrderModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.sellingOrderService.deleteSellingOrder(sellingOrder.id).subscribe(res => this.deleteImportingOrderCompleted(res));
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
