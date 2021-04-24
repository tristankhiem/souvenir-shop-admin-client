import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {CategoryModel} from '../../../data-services/schema/category.model';
import {CategoryService} from '../../../services/store/category.service';

declare var $: any;

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html'
})
export class UpdateCategoryComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private categoryService: CategoryService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateCategoryModalWrapper', {static: true}) updateCategoryModalWrapper: ModalWrapperComponent;
  @ViewChild('updateCategoryForm', {static: true}) updateCategoryForm: NgForm;

  public category: CategoryModel = new CategoryModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateCategoryModalWrapper.id} .modal-dialog`);
  }

  public show(category: CategoryModel, event: Event): void {
    event.preventDefault();
    this.getCategory(category.id);
    this.updateCategoryModalWrapper.show();

  }

  public hide(): void {
    this.updateCategoryForm.onReset();
    this.updateCategoryModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.category = new CategoryModel();
    this.updateCategoryForm.onReset();
  }

  private getCategory(id: number): void{
    this.loading.show();
    this.categoryService.getById(id).subscribe(res => this.getCategoryCompleted(res));
  }

  private getCategoryCompleted(res: ResponseModel<CategoryModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.category = res.result;
  }

  public isValid(): boolean{
    if (this.updateCategoryForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveCategory();
  }

  private saveCategory(): void {
    this.loading.show(this.targetModalLoading);
    this.categoryService.update(this.category).subscribe(res => this.saveCategoryCompleted(res));
  }

  private saveCategoryCompleted(res: ResponseModel<CategoryModel>): void {
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
