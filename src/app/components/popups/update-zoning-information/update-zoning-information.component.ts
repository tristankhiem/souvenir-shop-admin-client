import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {WardService} from '../../../services/district/ward.service';
import {CertificateService} from '../../../services/district/certificate.service';
import {DrawingTypeService} from '../../../services/district/drawing-type.service';
import {ZoningInformationService} from '../../../services/district/zoning-information.service';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {WardModel} from '../../../data-services/ward.model';
import {CertificateModel} from '../../../data-services/certificate.model';
import {DrawingTypeModel} from '../../../data-services/drawing-type.model';
import {ZoningInformationFullModel} from '../../../data-services/zoning-information-full.model';
import {INPUT_PATTERN_CONSTANT} from '../../../constants/input-pattern.constant';
import {InformationCoordinateModel} from '../../../data-services/information-coordinate.model';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {coordinateExtensions} from '../../../constants/accept-files.constant';

declare var $: any;
declare var readXlsxFile: any;

@Component({
  selector: 'app-update-zoning-information',
  templateUrl: './update-zoning-information.component.html'
})
export class UpdateZoningInformationComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private wardService: WardService,
    private certificateService: CertificateService,
    private drawingTypeService: DrawingTypeService,
    private zoningInformationService: ZoningInformationService
  ) { }

  @Output() saveCompleted: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('updateZoningInformationModalWrapper', {static: true}) updateZoningInformationModalWrapper: ModalWrapperComponent;
  @ViewChild('updateZoningInformationForm', {static: true}) updateZoningInformationForm: NgForm;
  @ViewChild('uploadCoordinateUpdateInput', {read: ElementRef}) uploadCoordinateUpdateInput: ElementRef;

  public wards: WardModel[] = [];
  public certificates: CertificateModel[] = [];
  public drawingTypes: DrawingTypeModel[] = [];
  public updatingZoningInformation: ZoningInformationFullModel = new ZoningInformationFullModel();

  public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;
  public phonePattern = INPUT_PATTERN_CONSTANT.phonePattern;

  private isLoaded = false;
  private countRequest: number;
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateZoningInformationModalWrapper.id} .modal-dialog`);
  }

  public show(zoningInformationId: number, event: Event): void {
    event.preventDefault();
    this.updateZoningInformationModalWrapper.show();

    this.loading.show(this.targetModalLoading);
    this.getZoningInformationFull(zoningInformationId);

    if (!this.isLoaded) {
      this.loadData();
    }
  }

  public hide(): void {
    this.updateZoningInformationModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.updatingZoningInformation = new ZoningInformationFullModel();
    this.updateZoningInformationForm.onReset();
  }

  public addCoordinate(): void {
    const tempCoordinate = new InformationCoordinateModel();

    const sizeCoors = this.updatingZoningInformation.informationCoordinates.length;
    tempCoordinate.id = sizeCoors ? this.updatingZoningInformation.informationCoordinates[sizeCoors - 1].id + 1 : 0;

    this.updatingZoningInformation.informationCoordinates.push(tempCoordinate);
  }

  public removeCoordinate(tempId: number): void {
    const indexCoor = this.updatingZoningInformation.informationCoordinates.findIndex( coor => +coor.id === +tempId );
    this.updatingZoningInformation.informationCoordinates.splice(indexCoor, 1);
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

      this.updatingZoningInformation.informationCoordinates = arrCoordinates.map((coor, index) => {
        const tempCoor = new InformationCoordinateModel();
        tempCoor.id = index;
        tempCoor.xcoordinate = coor[0];
        tempCoor.ycoordinate = coor[1];

        return tempCoor;
      });

      this.alert.success('Tải thành công');
      this.uploadCoordinateUpdateInput.nativeElement.value = '';
    });
  }

  public isValid(): boolean {
    if (this.updateZoningInformationForm.invalid) {
      return false;
    }

    if (+this.updatingZoningInformation.ward.id === 0 ||
      +this.updatingZoningInformation.drawingType.id === 0 ||
      +this.updatingZoningInformation.certificate.id === 0) {
      return false;
    }

    const lengthCoors = this.updatingZoningInformation.informationCoordinates.length;
    if (lengthCoors < 4) {
      return false;
    }

    const firstCoor = this.updatingZoningInformation.informationCoordinates[0];
    const lastCoor = this.updatingZoningInformation.informationCoordinates[lengthCoors - 1];
    if (firstCoor.xcoordinate !== lastCoor.xcoordinate || firstCoor.ycoordinate !== lastCoor.ycoordinate) {
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()) {
      return;
    }

    this.saveZoningInformation();
  }

  public getZoningInformationFull(zoningInformationId): void {
    this.zoningInformationService.getZoningInformation(zoningInformationId).subscribe(res => this.getZoningInformationFullCompleted(res));
  }

  private getZoningInformationFullCompleted(res: ResponseModel<ZoningInformationFullModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.updatingZoningInformation = res.result;
  }

  private loadData(): void {
    this.countRequest = 3;
    this.loading.show();
    this.getWards();
    this.getCertificates();
    this.getDrawingTypes();
  }

  private loadDataCompleted(): void {
    --this.countRequest;

    if (this.countRequest === 0) {
      this.isLoaded = true;
      this.loading.hide();
    }
  }

  private getWards(): void {
    this.wardService.findAll().subscribe(res => this.getWardsCompleted(res));
  }

  private getWardsCompleted(res: ResponseModel<WardModel[]>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.wards = res.result;
  }

  private getCertificates(): void {
    this.certificateService.findAll().subscribe(res => this.getCertificatesCompleted(res));
  }

  private getCertificatesCompleted(res: ResponseModel<CertificateModel[]>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.certificates = res.result;
  }

  private getDrawingTypes(): void {
    this.drawingTypeService.findAll().subscribe(res => this.getDrawingTypesCompleted(res));
  }

  private getDrawingTypesCompleted(res: ResponseModel<DrawingTypeModel[]>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.drawingTypes = res.result;
  }

  private saveZoningInformation(): void {
    this.loading.show(this.targetModalLoading);
    this.zoningInformationService.update(this.updatingZoningInformation).subscribe(res => this.saveZoningInformationCompleted(res));
  }

  private saveZoningInformationCompleted(res: ResponseModel<ZoningInformationFullModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.saveCompleted.emit();
    this.updatingZoningInformation = new ZoningInformationFullModel(res.result);
  }
}
