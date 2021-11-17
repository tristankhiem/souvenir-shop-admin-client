import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {SubCategoryService} from '../../../services/store/sub-category.service';
import {SubCategoryModel} from '../../../data-services/schema/sub-category.model';
import {ProductService} from '../../../services/store/product.service';
import {ProductModel} from '../../../data-services/schema/product.model';

declare var $: any;

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html'
})
export class UpdateProductComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private productService: ProductService,
    private subCategoryService: SubCategoryService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateProductModalWrapper', {static: true}) addSubCategoryModalWrapper: ModalWrapperComponent;
  @ViewChild('updateProductForm', {static: true}) addSubCategoryForm: NgForm;

  public product: ProductModel = new ProductModel();
  public subCategory: SubCategoryModel = new SubCategoryModel();
  public subCategoryResult: SubCategoryModel[] = [];
  private targetModalLoading: ElementRef;
  private typeFileImage = ['jpg', 'jpeg', 'png'];
  public files: FormData = new FormData();
  public sourcePath: string;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addSubCategoryModalWrapper.id} .modal-dialog`);
  }

  public show(product: SubCategoryModel, event: Event): void {
    event.preventDefault();
    this.deleteImageOnShow();
    this.getProduct(product.id);
    this.addSubCategoryModalWrapper.show();

  }

  public hide(): void {
    this.addSubCategoryForm.onReset();
    this.addSubCategoryModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.product = new ProductModel();
    this.addSubCategoryForm.onReset();
  }

  public isValid(): boolean {
    if (this.addSubCategoryForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveProduct();
  }

  public selectSubCategory(): void {
    this.product.subCategory = new SubCategoryModel(this.subCategory);
  }

  public searchSubCategories(event): void {
    this.loading.show(this.targetModalLoading);
    this.subCategoryService.getLikeName(event.query).subscribe(res => this.searchSubCategoryCompleted(res));
  }

  private searchSubCategoryCompleted(res: ResponseModel<SubCategoryModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.subCategoryResult = res.result || [];
  }

  private saveProduct(): void {
    this.loading.show(this.targetModalLoading);
    this.productService.update(this.product).subscribe(res => this.saveProductCompleted(res));
  }

  private saveProductCompleted(res: ResponseModel<ProductModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }
    this.product = res.result;
    this.saveAgencyImage();
  }

  public saveAgencyImage(): void {
    this.loading.show();
    if (this.sourcePath != null && this.product.imageUrl == null) {
      if (this.files != null) {
        this.productService.deleteImage(this.product.id)
          .subscribe(res => this.deleteAgencyImageCompleted(res, true));
      } else {
        this.productService.deleteImage(this.product.id)
          .subscribe(res => this.deleteAgencyImageCompleted(res, false));
      }
      return;
    }
    if (this.files != null) {
      this.productService.saveImage(this.product.id, this.files)
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
      this.alert.success('Cập nhật đại lý thành công!');
      this.hide();
      this.saveCompleted.emit(res.result);
    } else {
      this.productService.saveImage(this.product.id, this.files)
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
    this.alert.success('Cập nhật đại lý thành công!');
    this.hide();
    this.saveCompleted.emit(res.result);
  }

  private getProduct(id: number): void{
    this.loading.show();
    this.productService.getById(id).subscribe(res => this.getProductCompleted(res));
  }

  private getProductCompleted(res: ResponseModel<ProductModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.product = res.result;
    this.subCategory = this.product.subCategory;
    this.product.imageUrl = 'data:image/jpeg;base64,' + this.product.imageByte;
    this.sourcePath = this.product.imageUrl;
    this.files = null;
  }

  public deleteImageOnShow(): void {
    this.files = null;
    if (this.product.imageUrl == null && $('#updateImageAgencyData').attr('src') !== '../../../../assets/img/image-not-found.jpg') {
      $('#updateImageAgencyData').attr('src', '../../../../assets/img/image-not-found.jpg');
    }
  }

  public deleteImage(): void {
    this.product.imageUrl = null;
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
    if (this.product.imageUrl != null) {
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
