import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {SizeModel} from '../../data-services/schema/size.model';
import {ColorModel} from '../../data-services/schema/color.model';
import {SizeService} from '../../services/store/size.service';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html'
})
export class SizeComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private sizeService: SizeService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<SizeModel[]> = new BaseSearchModel<SizeModel[]>();

  ngOnInit(): void {
    this.getSize();
  }

  public onChangeDataEvent(search?: BaseSearchModel<SizeModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getSize(this.dataTableSize.nativeElement);
  }

  private getSize(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.sizeService.search(this.search).subscribe(res => this.getSizeCompleted(res, targetLoading));
  }

  private getSizeCompleted(res: ResponseModel<BaseSearchModel<SizeModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(size: SizeModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa size "${size.name}"?`, 'Xóa size hàng hoá', true)
      .subscribe(res => this.confirmDeleteSize(res, size));
  }

  private confirmDeleteSize(state: boolean, size: SizeModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.sizeService.deleteSize(size.id).subscribe(res => this.deleteSizeCompleted(res));
  }

  private deleteSizeCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
