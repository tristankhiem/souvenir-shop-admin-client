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
  selector: 'app-add-product-detail',
  templateUrl: './add-product-detail.component.html'
})
export class AddProductDetailComponent implements AfterViewInit {
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
  @ViewChild('addProductDetailModalWrapper', {static: true}) addProductDetailModalWrapper: ModalWrapperComponent;
  @ViewChild('addProductDetailForm', {static: true}) addProductDetailForm: NgForm;

  public productDetail: ProductDetailModel = new ProductDetailModel();
  public product: ProductModel = new ProductModel();
  public productResult: ProductModel[] = [];
  public color: ColorModel = new ColorModel();
  public colorResult: ColorModel[] = [];
  public size: SizeModel = new SizeModel();
  public sizeResult: SizeModel[] = [];
  private targetModalLoading: ElementRef;
  private typeFileImage = ['jpg', 'jpeg', 'png'];
  public files: FormData = new FormData();

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addProductDetailModalWrapper.id} .modal-dialog`);
  }
  public show(): void {
    this.addProductDetailModalWrapper.show();
    $('#imageAgencyData').attr('src', '../../../../assets/img/image-not-found.jpg');
    this.files = null;
  }

  public hide(): void {
    this.addProductDetailForm.onReset();
    this.addProductDetailModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.productDetail = new ProductDetailModel();
    this.addProductDetailForm.onReset();
  }

  public isValid(): boolean {
    if (this.addProductDetailForm.invalid){
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
    this.productDetailService.save(this.productDetail).subscribe(res => this.saveProductDetailCompleted(res));
  }

  private saveProductDetailCompleted(res: ResponseModel<ProductDetailModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.productDetail = res.result;
    this.saveProductImage();
  }

  public logImageMainEvent(event): void {
    const formData = new FormData();
    if (this.validateFiles(event.target.files)) {
      for (const item of event.target.files) {
        formData.append('files', item, item.name);
      }
      this.files = formData;
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          $('#imageAgencyData').attr('src', e.target.result);
        };

        reader.readAsDataURL(event.target.files[0]);
      }
    }
    $('#imgAgency').val(null);
  }

  public deleteImage(): void {
    this.productDetail.imageUrl = null;
    this.files = null;
    $('#imageAgencyData').attr('src', '../../../../assets/img/image-not-found.jpg');
  }

  private validateFiles(files: File[]): boolean {
    for (const item of files){
      const typeOfFile = item.name.split('.').pop();
      let flag = false;
      for (const temp of this.typeFileImage){
        if (temp === typeOfFile){
          flag = true;
          break;
        }
      }
      if (flag === false){
        this.alert.error('Chỉ chọn file ảnh có định dạng jpg, jpeg, png');
        return false;
      }
    }
    return true;
  }

  public saveProductImage(): void {
    this.loading.show();
    this.productDetailService.saveImage(this.productDetail.id, this.files).subscribe(res => this.saveProductImageCompleted(res));
  }

  private saveProductImageCompleted(res: ResponseModel<string[]>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.alert.success('Thêm hàng hóa thành công!');
    this.hide();
    this.saveCompleted.emit(res.result);
  }
}
