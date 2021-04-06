import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {WardService} from '../../../services/district/ward.service';
import {ZoningBaseService} from '../../../services/district/zoning-base.service';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {WardModel} from '../../../data-services/ward.model';
import {ZoningBaseFullModel} from '../../../data-services/zoning-base-full.model';
import {BaseCoordinateModel} from '../../../data-services/base-coordinate.model';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {coordinateExtensions} from '../../../constants/accept-files.constant';

declare var $: any;
declare var readXlsxFile: any;

@Component({
  selector: 'app-update-zoning-base',
  templateUrl: './update-zoning-base.component.html',
})
export class UpdateZoningBaseComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private wardService: WardService,
    private zoningBaseService: ZoningBaseService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateZoningBaseModalWrapper', {static: true}) updateZoningBaseModalWrapper: ModalWrapperComponent;
  @ViewChild('updateZoningBaseForm', {static: true}) updateZoningBaseForm: NgForm;
  @ViewChild('uploadCoordinateUpdateInput', {read: ElementRef}) uploadCoordinateUpdateInput: ElementRef;

  public wards: WardModel[] = [];
  public updatingZoningBase: ZoningBaseFullModel = new ZoningBaseFullModel();

  private isLoaded = false;
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateZoningBaseModalWrapper.id} .modal-dialog`);
  }

  public show(zoningBaseId: number, event: Event): void {
    event.preventDefault();
    this.loading.show(this.targetModalLoading);
    this.getZoningBase(zoningBaseId);

    this.updateZoningBaseModalWrapper.show();

    if (!this.isLoaded) {
      this.loading.show();
      this.getWards();
    }
  }

  public hide(): void {
    this.updateZoningBaseModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.updatingZoningBase = new ZoningBaseFullModel();
    this.updateZoningBaseForm.onReset();
  }

  public addCoordinate(): void {
    const tempCoordinate = new BaseCoordinateModel();

    const sizeCoors = this.updatingZoningBase.baseCoordinates.length;
    tempCoordinate.id = sizeCoors ? this.updatingZoningBase.baseCoordinates[sizeCoors - 1].id + 1 : 0;

    this.updatingZoningBase.baseCoordinates.push(tempCoordinate);
  }

  public removeCoordinate(tempId: number): void {
    const indexCoor = this.updatingZoningBase.baseCoordinates.findIndex( coor => +coor.id === +tempId );
    this.updatingZoningBase.baseCoordinates.splice(indexCoor, 1);
  }

  public uploadCoordinate(event: Event): void {
    const uploadInput: HTMLInputElement = event.target as HTMLInputElement;

    if (!uploadInput.files[0]) {
      return;
    }

    const fileName = uploadInput.files[0].name.split('.');
    const isValidExtension = coordinateExtensions.findIndex( ext => ext === fileName[fileName.length - 1] );

    if (isValidExtension === -1) {
      this.alert.error('Tệp tin không hợp lệ');
      return;
    }

    const arrCoordinates = [];
    readXlsxFile(uploadInput.files[0]).then((rows) => {
      for (const row of rows) {
        if (isNaN(+row[0]) || isNaN(+row[1])) {
          this.alert.error('Tệp tin không hợp lệ');
          return;
        }
        arrCoordinates.push(row);
      }

      this.updatingZoningBase.baseCoordinates = arrCoordinates.map((coor, index) => {
        const tempCoor = new BaseCoordinateModel();
        tempCoor.id = index;
        tempCoor.xcoordinate = coor[0];
        tempCoor.ycoordinate = coor[1];

        return tempCoor;
      });

      this.uploadCoordinateUpdateInput.nativeElement.value = '';
      this.alert.success('Tải thành công');
    });
  }

  public isValid(): boolean {
    if (this.updateZoningBaseForm.invalid) {
      return false;
    }

    if (+this.updatingZoningBase.ward.id === 0) {
      return false;
    }

    const lengthCoors = this.updatingZoningBase.baseCoordinates.length;
    if (lengthCoors < 4) {
      return false;
    }

    const firstCoor = this.updatingZoningBase.baseCoordinates[0];
    const lastCoor = this.updatingZoningBase.baseCoordinates[lengthCoors - 1];
    if (firstCoor.xcoordinate !== lastCoor.xcoordinate || firstCoor.ycoordinate !== lastCoor.ycoordinate) {
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()) {
      return;
    }

    this.saveZoningBase();

  }

  private getZoningBase(id: number): void {
    this.zoningBaseService.getZoningBase(id).subscribe(res => this.getZoningBaseCompleted(res));
  }

  private getZoningBaseCompleted(res: ResponseModel<ZoningBaseFullModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.updatingZoningBase = new ZoningBaseFullModel(res.result);
  }

  private getWards(): void {
    this.wardService.findAll().subscribe(res => this.getWardsCompleted(res));
  }

  private getWardsCompleted(res: ResponseModel<WardModel[]>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.wards = res.result;
    this.isLoaded = true;
  }

  private saveZoningBase(): void {
    this.loading.show(this.targetModalLoading);
    this.zoningBaseService.update(this.updatingZoningBase).subscribe(res => this.saveZoningBaseCompleted(res));
  }

  private saveZoningBaseCompleted(res: ResponseModel<ZoningBaseFullModel>): void {
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
