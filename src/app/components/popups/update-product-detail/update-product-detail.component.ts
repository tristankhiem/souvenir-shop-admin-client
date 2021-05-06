import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {ColorService} from '../../../services/store/color.service';
import {ColorModel} from '../../../data-services/schema/color.model';
import {SizeService} from '../../../services/store/size.service';
import {SizeModel} from '../../../data-services/schema/size.model';
import {ProductModel} from '../../../data-services/schema/product.model';
import {ProductDetailService} from '../../../services/store/product-detail.service';
import {ProductDetailModel} from '../../../data-services/schema/product-detail.model';
import {ProductService} from 'src/app/services/store/product.service';

declare var $: any;

@Component({
  selector: 'app-update-product-detail',
  templateUrl: './update-product-detail.component.html'
})
export class UpdateProductDetailComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private productDetailService: ProductDetailService,
    private sizeService: SizeService,
    private colorService: ColorService,
    private productService: ProductService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateProductDetailModalWrapper', {static: true}) updateProductDetailModalWrapper: ModalWrapperComponent;
  @ViewChild('updateProductDetailForm', {static: true}) updateProductDetailForm: NgForm;

  public productDetail: ProductDetailModel = new ProductDetailModel();
  public product: ProductModel = new ProductModel();
  public productResult: ProductModel[] = [];
  public color: ColorModel = new ColorModel();
  public colorResult: ColorModel[] = [];
  public size: SizeModel = new SizeModel();
  public sizeResult: SizeModel[] = [];
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateProductDetailModalWrapper.id} .modal-dialog`);
  }

  public show(productDetail: ProductDetailModel, event: Event): void {
    event.preventDefault();
    this.getProductDetail(productDetail.id);
    this.updateProductDetailModalWrapper.show();

  }

  public hide(): void {
    this.updateProductDetailForm.onReset();
    this.updateProductDetailModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.productDetail = new ProductDetailModel();
    this.updateProductDetailForm.onReset();
  }

  public isValid(): boolean {
    if (this.updateProductDetailForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveProductDetail();
  }

  public selectSize(): void {
    this.productDetail.size = new SizeModel(this.size);
  }

  public searchSize(event): void {
    this.loading.show(this.targetModalLoading);
    this.sizeService.getLikeName(event.query).subscribe(res => this.searchSizeCompleted(res));
  }

  private searchSizeCompleted(res: ResponseModel<SizeModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.sizeResult = res.result || [];
  }

  public selectColor(): void {
    this.productDetail.color = new ColorModel(this.color);
  }

  public searchColor(event): void {
    this.loading.show(this.targetModalLoading);
    this.colorService.getLikeName(event.query).subscribe(res => this.searchColorCompleted(res));
  }

  private searchColorCompleted(res: ResponseModel<ColorModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.colorResult = res.result || [];
  }
  public selectProduct(): void {
    this.productDetail.product = new ProductModel(this.product);
  }

  public searchProduct(event): void {
    this.loading.show(this.targetModalLoading);
    this.productService.getLikeName(event.query).subscribe(res => this.searchProductCompleted(res));
  }

  private searchProductCompleted(res: ResponseModel<ProductModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.productResult = res.result || [];
  }

  private saveProductDetail(): void {
    this.loading.show(this.targetModalLoading);
    this.productDetailService.update(this.productDetail).subscribe(res => this.saveProductDetailCompleted(res));
  }

  private saveProductDetailCompleted(res: ResponseModel<ProductDetailModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.saveCompleted.emit();
    this.hide();
  }

  private getProductDetail(id: number): void{
    this.loading.show();
    this.productDetailService.getById(id).subscribe(res => this.getProductDetailCompleted(res));
  }

  private getProductDetailCompleted(res: ResponseModel<ProductDetailModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.productDetail = res.result;
    this.size = this.productDetail.size;
    this.color = this.productDetail.color;
    this.product = this.productDetail.product;
  }
}
