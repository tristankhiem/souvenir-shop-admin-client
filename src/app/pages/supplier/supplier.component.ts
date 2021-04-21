import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {SupplierModel} from '../../data-services/schema/supplier.model';
import {CategoryService} from '../../services/store/category.service';
import {SupplierService} from '../../services/store/supplier.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html'
})

export class SupplierComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private supplierService: SupplierService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<SupplierModel[]> = new BaseSearchModel<SupplierModel[]>();

  ngOnInit(): void {
    this.getSupplier();
  }

  public onChangeDataEvent(search?: BaseSearchModel<SupplierModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getSupplier(this.dataTableSize.nativeElement);
  }

  private getSupplier(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.supplierService.search(this.search).subscribe(res => this.getSupplierCompleted(res, targetLoading));
  }

  private getSupplierCompleted(res: ResponseModel<BaseSearchModel<SupplierModel[]>>, targetLoading: ElementRef): void {
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
    this.loading.hide(targetLoading);
  }

  public openDeleteModal(supplier: SupplierModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.name}"?`, 'Xóa nhà cung cấp', true)
      .subscribe(res => this.confirmDeleteCategory(res, supplier));
  }

  private confirmDeleteCategory(state: boolean, supplier: SupplierModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.supplierService.deleteSupplier(supplier.id).subscribe(res => this.deleteSupplierCompleted(res));
  }

  private deleteSupplierCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }


}
