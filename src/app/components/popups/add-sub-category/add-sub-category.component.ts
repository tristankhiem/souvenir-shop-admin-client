import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {SubCategoryService} from '../../../services/store/sub-category.service';
import {SubCategoryModel} from '../../../data-services/schema/sub-category.model';
import {CategoryModel} from '../../../data-services/schema/category.model';
import {CategoryService} from '../../../services/store/category.service';

declare var $: any;

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html'
})
export class AddSubCategoryComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addSubCategoryModalWrapper', {static: true}) addSubCategoryModalWrapper: ModalWrapperComponent;
  @ViewChild('addSubCategoryForm', {static: true}) addSubCategoryForm: NgForm;

  public subCategory: SubCategoryModel = new SubCategoryModel();
  public category: CategoryModel = new CategoryModel();
  public categoryResult: CategoryModel[] = [];
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addSubCategoryModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.addSubCategoryModalWrapper.show();

  }

  public hide(): void {
    this.addSubCategoryForm.onReset();
    this.addSubCategoryModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.subCategory = new SubCategoryModel();
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
    this.subCategoryService.save(this.subCategory).subscribe(res => this.saveSubCategoryCompleted(res));
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
