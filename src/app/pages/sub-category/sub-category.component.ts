import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {SubCategoryModel} from '../../data-services/schema/sub-category.model';
import {SubCategoryService} from '../../services/store/sub-category.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html'
})
export class SubCategoryComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private subCategoryService: SubCategoryService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<SubCategoryModel[]> = new BaseSearchModel<SubCategoryModel[]>();

  ngOnInit(): void {
    this.getSubCategory();
  }

  public onChangeDataEvent(search?: BaseSearchModel<SubCategoryModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getSubCategory(this.dataTableSize.nativeElement);
  }

  private getSubCategory(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.subCategoryService.search(this.search).subscribe(res => this.getSubCategoryCompleted(res, targetLoading));
  }

  private getSubCategoryCompleted(res: ResponseModel<BaseSearchModel<SubCategoryModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(subCategory: SubCategoryModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa danh mục con "${subCategory.name}"?`, 'Xóa danh mục con hàng hoá', true)
      .subscribe(res => this.confirmDeleteSubCategory(res, subCategory));
  }

  private confirmDeleteSubCategory(state: boolean, subCategory: SubCategoryModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.subCategoryService.deleteSubCategory(subCategory.id).subscribe(res => this.deleteSubCategoryCompleted(res));
  }

  private deleteSubCategoryCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
