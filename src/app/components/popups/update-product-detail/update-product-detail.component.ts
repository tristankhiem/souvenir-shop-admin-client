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
  private typeFileImage = ['jpg', 'jpeg', 'png'];
  public files: FormData = new FormData();
  public sourcePath: string;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateProductDetailModalWrapper.id} .modal-dialog`);
  }

  public show(productDetail: ProductDetailModel, event: Event): void {
    event.preventDefault();
    this.deleteImageOnShow();
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

    this.productDetail = res.result;
    this.saveAgencyImage();
  }

  private getProductDetail(id: string): void{
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
    this.productDetail.imageUrl = 'data:image/jpeg;base64,' + this.productDetail.imageByte;
    this.sourcePath = this.productDetail.imageUrl;
    this.files = null;
  }

  public saveAgencyImage(): void {
    this.loading.show();
    if (this.sourcePath != null && this.productDetail.imageUrl == null) {
      if (this.files != null) {
        this.productDetailService.deleteImage(this.productDetail.id)
          .subscribe(res => this.deleteAgencyImageCompleted(res, true));
      } else {
        this.productDetailService.deleteImage(this.productDetail.id)
          .subscribe(res => this.deleteAgencyImageCompleted(res, false));
      }
      return;
    }
    if (this.files != null) {
      this.productDetailService.saveImage(this.productDetail.id, this.files)
        .subscribe(res => this.saveAgencyImageCompleted(res));
      return;
    }
    this.alert.success('Cập nhật hàng hóa thành công!');
    this.hide();
    this.saveCompleted.emit();
  }

  private deleteAgencyImageCompleted(res: ResponseModel<string[]>, haveNewImage: boolean): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    if (haveNewImage === false) {
      this.alert.success('Cập nhật hàng hóa thành công!');
      this.hide();
      this.saveCompleted.emit(res.result);
    } else {
      this.productDetailService.saveImage(this.productDetail.id, this.files)
        .subscribe(res2 => this.saveAgencyImageCompleted(res2));
    }
  }

  private saveAgencyImageCompleted(res: ResponseModel<string[]>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.alert.success('Cập nhật hàng hóa thành công!');
    this.hide();
    this.saveCompleted.emit(res.result);
  }

  public deleteImageOnShow(): void {
    this.files = null;
    if (this.productDetail.imageUrl == null && $('#updateImageAgencyData').attr('src') !== '../../../../assets/img/image-not-found.jpg') {
      $('#updateImageAgencyData').attr('src', '../../../../assets/img/image-not-found.jpg');
    }
  }

  public deleteImage(): void {
    this.productDetail.imageUrl = null;
    this.files = null;
    if ($('#updateImageAgencyData').attr('src') !== '../../../../assets/img/image-not-found.jpg') {
      $('#updateImageAgencyData').attr('src', '../../../../assets/img/image-not-found.jpg');
    }
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

  public logUpdateImageMainEvent(event): void {
    if (this.productDetail.imageUrl != null) {
      this.alert.error('Vui lòng xóa ảnh trước khi chọn ảnh mới');
      return;
    }
    const formData = new FormData();
    if (this.validateFiles(event.target.files)) {
      for (const item of event.target.files) {
        formData.append('files', item, item.name);
      }
      this.files = formData;
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          $('#updateImageAgencyData').attr('src', e.target.result);
        };

        reader.readAsDataURL(event.target.files[0]);
      }
    }
    $('#updateImgAgency').val(null);
  }
}
