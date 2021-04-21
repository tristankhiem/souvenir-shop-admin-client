import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ColorService} from '../../services/store/color.service';
import {ColorModel} from '../../data-services/schema/color.model';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html'
})
export class ColorComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private colorService: ColorService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<ColorModel[]> = new BaseSearchModel<ColorModel[]>();

  ngOnInit(): void {
    this.getColor();
  }

  public onChangeDataEvent(search?: BaseSearchModel<ColorModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getColor(this.dataTableSize.nativeElement);
  }

  private getColor(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.colorService.search(this.search).subscribe(res => this.getColorCompleted(res, targetLoading));
  }

  private getColorCompleted(res: ResponseModel<BaseSearchModel<ColorModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
    console.log(this.search);
  }

  public openDeleteModal(color: ColorModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa màu "${color.name}"?`, 'Xóa màu sắc', true)
      .subscribe(res => this.confirmDeleteColor(res, color));
  }

  private confirmDeleteColor(state: boolean, color: ColorModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.colorService.deleteColor(color.id).subscribe(res => this.deleteColorCompleted(res));
  }

  private deleteColorCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
