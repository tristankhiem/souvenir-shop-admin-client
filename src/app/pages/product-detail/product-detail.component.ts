import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ProductDetailService} from '../../services/store/product-detail.service';
import {ProductDetailModel} from '../../data-services/schema/product-detail.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private productDetailService: ProductDetailService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<ProductDetailModel[]> = new BaseSearchModel<ProductDetailModel[]>();

  ngOnInit(): void {
    this.getProductDetail();
  }

  public onChangeDataEvent(search?: BaseSearchModel<ProductDetailModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getProductDetail(this.dataTableSize.nativeElement);
  }

  private getProductDetail(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.productDetailService.search(this.search).subscribe(res => this.getProductDetailCompleted(res, targetLoading));
  }

  private getProductDetailCompleted(res: ResponseModel<BaseSearchModel<ProductDetailModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(productdetail: ProductDetailModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa chi tiết hàng hoá "${productdetail.name}"?`, 'Xóa chi tiết hàng hoá', true)
      .subscribe(res => this.confirmDeleteProductDetail(res, productdetail));
  }

  private confirmDeleteProductDetail(state: boolean, productdetail: ProductDetailModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.productDetailService.deleteProductDetail(productdetail.id).subscribe(res => this.deleteProductDetailCompleted(res));
  }

  private deleteProductDetailCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }
}
