import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../../../data-services/search/base-search.model';
import {ZoningInformationModel} from '../../../../data-services/zoning-information.model';
import {AppAlert, AppLoading, AppModals} from '../../../../utils';
import {ZoningInformationService} from '../../../../services/district/zoning-information.service';
import {ResponseModel} from '../../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../../constants/http-code.constant';

@Component({
  selector: 'app-zoning-information',
  templateUrl: './zoning-information.component.html'
})
export class ZoningInformationComponent implements OnInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private zoningInformationService: ZoningInformationService,
  ) { }

  @ViewChild('dataTableZoningInformation', {read: ElementRef}) dataTableZoningInformation: ElementRef;

  public search: BaseSearchModel<ZoningInformationModel[]> = new BaseSearchModel<ZoningInformationModel[]>();

  ngOnInit(): void {
    this.getZoningInformation();
  }

  public onChangeDataEvent(search?: BaseSearchModel<ZoningInformationModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.loading.show(this.dataTableZoningInformation.nativeElement);
    this.getZoningInformation(this.dataTableZoningInformation.nativeElement);
  }

  public openDeleteModal(zoningInformationId: number, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa thông tin đất có mã số ${zoningInformationId}?`, 'Xóa thông tin đất', true)
      .subscribe(res => this.confirmDeleteZoningInformation(res, zoningInformationId));
  }

  public confirmDeleteZoningInformation(state: boolean, zoningInformationId: number): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.zoningInformationService.deleteZoningInformation(zoningInformationId).subscribe(res => this.deleteZoningInformationCompleted(res));
  }

  public getZoningInformation(targetLoading?: ElementRef): void {
    this.zoningInformationService.find(this.search).subscribe(res => this.getZoningInformationCompleted(res, targetLoading));
  }

  private getZoningInformationCompleted(res: ResponseModel<BaseSearchModel<ZoningInformationModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.search = res.result;
  }

  private deleteZoningInformationCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }
}
