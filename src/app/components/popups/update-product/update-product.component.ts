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

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addSubCategoryModalWrapper.id} .modal-dialog`);
  }

  public show(product: SubCategoryModel, event: Event): void {
    event.preventDefault();
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

  private saveProductCompleted(res: ResponseModel<SubCategoryModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.saveCompleted.emit();
    this.hide();
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
  }
}
