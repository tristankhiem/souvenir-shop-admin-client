import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {SubCategoryModel} from '../../../data-services/schema/sub-category.model';
import {SubCategoryService} from '../../../services/store/sub-category.service';
import {CategoryModel} from '../../../data-services/schema/category.model';
import {CategoryService} from '../../../services/store/category.service';

declare var $: any;

@Component({
  selector: 'app-update-sub-category',
  templateUrl: './update-sub-category.component.html'
})
export class UpdateSubCategoryComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateSubCategoryModalWrapper', {static: true}) updateSubCategoryModalWrapper: ModalWrapperComponent;
  @ViewChild('updateSubCategoryForm', {static: true}) updateSubCategoryForm: NgForm;

  public subCategory: SubCategoryModel = new SubCategoryModel();
  public category: CategoryModel = new CategoryModel();
  public categoryResult: CategoryModel[] = [];
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateSubCategoryModalWrapper.id} .modal-dialog`);
  }

  public show(subCategory: SubCategoryModel, event: Event): void {
    event.preventDefault();
    this.getSubCategory(subCategory.id);
    this.updateSubCategoryModalWrapper.show();

  }

  public hide(): void {
    this.updateSubCategoryForm.onReset();
    this.updateSubCategoryModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.subCategory = new SubCategoryModel();
    this.updateSubCategoryForm.onReset();
  }

  private getSubCategory(id: number): void{
    this.loading.show();
    this.subCategoryService.getById(id).subscribe(res => this.getCategoryCompleted(res));
  }

  private getCategoryCompleted(res: ResponseModel<SubCategoryModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.subCategory = res.result;
    this.category = this.subCategory.category;
  }

  public isValid(): boolean{
    if (this.updateSubCategoryForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveSubCategory();
  }

  public selectCategory(): void {
    this.subCategory.category = new CategoryModel(this.category);
  }

  public searchCategories(event): void {
    this.loading.show(this.targetModalLoading);
    this.categoryService.getLikeName(event.query).subscribe(res => this.searchCategoryCompleted(res));
  }

  private searchCategoryCompleted(res: ResponseModel<CategoryModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.categoryResult = res.result || [];
  }

  private saveSubCategory(): void {
    this.loading.show(this.targetModalLoading);
    this.subCategoryService.update(this.subCategory).subscribe(res => this.saveSubCategoryCompleted(res));
  }

  private saveSubCategoryCompleted(res: ResponseModel<SubCategoryModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.saveCompleted.emit();
    this.hide();
  }
}
