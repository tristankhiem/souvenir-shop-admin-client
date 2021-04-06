import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../../../utils';
import {BaseSearchModel} from '../../../../data-services/search/base-search.model';
import {ResponseModel} from '../../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../../constants/http-code.constant';
import {ZoningBaseService} from '../../../../services/district/zoning-base.service';
import {ZoningTypeModel} from '../../../../data-services/zoning-type.model';
import {ZoningBaseModel} from '../../../../data-services/zoning-base.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-zoning-base',
  templateUrl: './zoning-base.component.html'
})
export class ZoningBaseComponent implements OnInit, OnDestroy {
  constructor(
    private root: ElementRef,
    private zoningBaseService: ZoningBaseService,
    private loading: AppLoading,
    private alert: AppAlert,
    private router: Router,
    private route: ActivatedRoute,
    private modal: AppModals
  ){}

  @ViewChild('dataTableZoningBase', {read: ElementRef}) dataTableZoningBase: ElementRef;

  public zoningTypes: ZoningTypeModel[] = [];
  public zoningTypeIndexSelected = 0;
  public search: BaseSearchModel<ZoningBaseModel[]> = new BaseSearchModel<ZoningBaseModel[]>();

  private subcribeTypeSlug: Subscription;

  ngOnInit(): void {
    // Get data from resolver service
    this.route.data.pipe(
      map(data => data.zoningTypes)
    ).subscribe( data => {
      this.getZoningTypesCompleted(data);
    } );

    // Subcribe on change path
    this.subcribeTypeSlug = this.route.params.subscribe( param => {
      if (param.typeSlug) {
        this.zoningTypeIndexSelected = this.getIndexType(param.typeSlug);

        this.loading.show();
        this.search.result = [];
        this.getZoningBases();
      }
    } );
  }

  ngOnDestroy(): void {
    this.subcribeTypeSlug.unsubscribe();
  }

  public openDeleteModal(zoningBaseId: number, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa quy hoạch có mã số ${zoningBaseId}?`, 'Xóa thông tin quy hoạch', true)
      .subscribe(res => this.confirmDeleteZoningBase(res, zoningBaseId));
  }

  public onChangeDataTypeEvent(event: any): void {
    this.router.navigate(['/quan-ly-quy-hoach', event.currentTarget.value]);
  }

  public onChangeDataEvent(search?: BaseSearchModel<ZoningBaseModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.loading.show(this.dataTableZoningBase.nativeElement);
    this.getZoningBases(this.dataTableZoningBase.nativeElement);
  }

  private getZoningTypesCompleted(res: ResponseModel<ZoningTypeModel[]>): void {
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.zoningTypes = res.result;
  }

  private getZoningBases(targetLoading?: ElementRef): void {
    this.zoningBaseService.find(this.search, this.zoningTypes[this.zoningTypeIndexSelected].id)
      .subscribe(res => this.getZoningBasesCompleted(res, targetLoading));
  }

  private getZoningBasesCompleted(res: ResponseModel<BaseSearchModel<ZoningBaseModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.search = res.result;
  }

  private getIndexType(typeSlug: string): number {
    let indexType = 0;
    if (typeSlug) {
      const ind = this.zoningTypes.findIndex(type => typeSlug === type.nameSlug);
      indexType = ind !== -1 ? ind : indexType;
    }

    return indexType;
  }

  private confirmDeleteZoningBase(state: boolean, zoningBaseId: number): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.zoningBaseService.deleteZoningBase(zoningBaseId).subscribe(res => this.deleteZoningBaseCompleted(res));
  }

  private deleteZoningBaseCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
