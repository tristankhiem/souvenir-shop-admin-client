import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ProductService} from '../../services/store/product.service';
import {ProductModel} from '../../data-services/schema/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private productService: ProductService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<ProductModel[]> = new BaseSearchModel<ProductModel[]>();

  ngOnInit(): void {
    this.getProduct();
  }

  public onChangeDataEvent(search?: BaseSearchModel<ProductModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getProduct(this.dataTableSize.nativeElement);
  }

  private getProduct(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.productService.search(this.search).subscribe(res => this.getProductCompleted(res, targetLoading));
  }

  private getProductCompleted(res: ResponseModel<BaseSearchModel<ProductModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(product: ProductModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa hàng hoá "${product.name}"?`, 'Xóa hàng hoá', true)
      .subscribe(res => this.confirmDeleteProduct(res, product));
  }

  private confirmDeleteProduct(state: boolean, product: ProductModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.productService.deleteProduct(product.id).subscribe(res => this.deleteProductCompleted(res));
  }

  private deleteProductCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
