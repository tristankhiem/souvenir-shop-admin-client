import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {SizeService} from '../../../services/store/size.service';
import {CategoryModel} from '../../../data-services/schema/category.model';
import {CategoryService} from '../../../services/store/category.service';

declare var $: any;

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html'
})
export class AddCategoryComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private categoryService: CategoryService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addCategoryModalWrapper', {static: true}) addCategoryModalWrapper: ModalWrapperComponent;
  @ViewChild('addCategoryForm', {static: true}) addCategoryForm: NgForm;

  public category: CategoryModel = new CategoryModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addCategoryModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.addCategoryModalWrapper.show();

  }

  public hide(): void {
    this.addCategoryForm.onReset();
    this.addCategoryModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.category = new CategoryModel();
    this.addCategoryForm.onReset();
  }

  public isValid(): boolean {
    if (this.addCategoryForm.invalid){
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
    this.categoryService.save(this.category).subscribe(res => this.saveCategoryCompleted(res));
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
