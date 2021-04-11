import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {CategoryModel} from '../../data-services/schema/category.model';
import {CategoryService} from '../../services/store/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private categoryService: CategoryService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<CategoryModel[]> = new BaseSearchModel<CategoryModel[]>();

  ngOnInit(): void {
    this.getCategory();
  }

  public onChangeDataEvent(search?: BaseSearchModel<CategoryModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getCategory(this.dataTableSize.nativeElement);
  }

  private getCategory(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.categoryService.search(this.search).subscribe(res => this.getCategoryCompleted(res, targetLoading));
  }

  private getCategoryCompleted(res: ResponseModel<BaseSearchModel<CategoryModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(category: CategoryModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`, 'Xóa danh mục hàng hoá', true)
      .subscribe(res => this.confirmDeleteCategory(res, category));
  }

  private confirmDeleteCategory(state: boolean, category: CategoryModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.categoryService.deleteCategory(category.id).subscribe(res => this.deleteCategoryCompleted(res));
  }

  private deleteCategoryCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
