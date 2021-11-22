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
  selector: 'app-add-product',
  templateUrl: './add-product.component.html'
})
export class AddProductComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private productService: ProductService,
    private subCategoryService: SubCategoryService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addProductModalWrapper', {static: true}) addSubCategoryModalWrapper: ModalWrapperComponent;
  @ViewChild('addProductForm', {static: true}) addSubCategoryForm: NgForm;

  public product: ProductModel = new ProductModel();
  public subCategory: SubCategoryModel = new SubCategoryModel();
  public subCategoryResult: SubCategoryModel[] = [];
  private targetModalLoading: ElementRef;
  private typeFileImage = ['jpg', 'jpeg', 'png', 'JPG'];
  public files: FormData = new FormData();


  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addSubCategoryModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.addSubCategoryModalWrapper.show();
    $('#imageAgencyData').attr('src', '../../../../assets/img/image-not-found.jpg');
    this.files = null;
  }

  public hide(): void {
    this.addSubCategoryForm.onReset();
    this.addSubCategoryModalWrapper.hide();
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
    this.product.imageUrl = null;
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
    this.productService.saveImage(this.product.id, this.files).subscribe(res => this.saveProductImageCompleted(res));
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
    this.productService.save(this.product).subscribe(res => this.saveProductCompleted(res));
  }

  private saveProductCompleted(res: ResponseModel<ProductModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.product = res.result;
    this.saveProductImage();
  }
}
