import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {ZoningInformationService} from '../../../services/district/zoning-information.service';
import {ResponseModel} from '../../../data-services/response.model';
import {ZoningInformationModel} from '../../../data-services/zoning-information.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {WardService} from '../../../services/district/ward.service';
import {WardModel} from '../../../data-services/ward.model';
import {INPUT_PATTERN_CONSTANT} from '../../../constants/input-pattern.constant';
import {CertificateService} from '../../../services/district/certificate.service';
import {DrawingTypeService} from '../../../services/district/drawing-type.service';
import {DrawingTypeModel} from '../../../data-services/drawing-type.model';
import {CertificateModel} from '../../../data-services/certificate.model';
import {ZoningInformationFullModel} from '../../../data-services/zoning-information-full.model';
import {InformationCoordinateModel} from '../../../data-services/information-coordinate.model';
import {coordinateExtensions} from '../../../constants/accept-files.constant';
import {BaseCoordinateModel} from '../../../data-services/base-coordinate.model';

declare var $: any;
declare var readXlsxFile: any;

@Component({
  selector: 'app-add-zoning-information',
  templateUrl: './add-zoning-information.component.html'
})
export class AddZoningInformationComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private wardService: WardService,
    private certificateService: CertificateService,
    private drawingTypeService: DrawingTypeService,
    private zoningInformationService: ZoningInformationService
  ) { }

  @Output() saveCompleted: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('addZoningInformationModalWrapper', {static: true}) addZoningInformationModalWrapper: ModalWrapperComponent;
  @ViewChild('addZoningInformationForm', {static: true}) addZoningInformationForm: NgForm;
  @ViewChild('uploadCoordinateAddInput', {read: ElementRef}) uploadCoordinateAddInput: ElementRef;

  public wards: WardModel[] = [];
  public certificates: CertificateModel[] = [];
  public drawingTypes: DrawingTypeModel[] = [];
  public newZoningInformation: ZoningInformationFullModel = new ZoningInformationFullModel();
  public hasResult = false;

  public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;
  public phonePattern = INPUT_PATTERN_CONSTANT.phonePattern;

  private isLoaded = false;
  private countRequest: number;
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addZoningInformationModalWrapper.id} .modal-dialog`);
  }

  private onInit(): void {
    this.newZoningInformation.ward.id = 0;
    this.newZoningInformation.certificate.id = 0;
    this.newZoningInformation.drawingType.id = 0;
    this.newZoningInformation.ownerBirthDate = new Date().getTime().toString();
    this.newZoningInformation.drawingDate = new Date().getTime().toString();
    this.newZoningInformation.certificateDate = new Date().getTime().toString();

    const arrCoordinate = ['', '', '', ''].map((coor, index) => {
      const tempCoor = new InformationCoordinateModel();
      tempCoor.id = index;
      return tempCoor;
    });
    this.newZoningInformation.informationCoordinates = arrCoordinate;
  }

  public show(): void {
    this.onInit();
    this.addZoningInformationModalWrapper.show();
    if (!this.isLoaded) {
      this.loadData();
    }
  }

  public hide(): void {
    this.addZoningInformationModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.newZoningInformation = new ZoningInformationFullModel();
    this.addZoningInformationForm.onReset();
    this.hasResult = false;
  }

  public addCoordinate(): void {
    const tempCoordinate = new InformationCoordinateModel();

    const sizeCoors = this.newZoningInformation.informationCoordinates.length;
    tempCoordinate.id = sizeCoors ? this.newZoningInformation.informationCoordinates[sizeCoors - 1].id + 1 : 0;

    this.newZoningInformation.informationCoordinates.push(tempCoordinate);
  }

  public removeCoordinate(tempId: number): void {
    const indexCoor = this.newZoningInformation.informationCoordinates.findIndex( coor => +coor.id === +tempId );
    this.newZoningInformation.informationCoordinates.splice(indexCoor, 1);
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

      this.newZoningInformation.informationCoordinates = arrCoordinates.map((coor, index) => {
        const tempCoor = new InformationCoordinateModel();
        tempCoor.id = index;
        tempCoor.xcoordinate = coor[0];
        tempCoor.ycoordinate = coor[1];

        return tempCoor;
      });

      this.alert.success('Tải thành công');
      this.uploadCoordinateAddInput.nativeElement.value = '';
    });
  }

  public isValid(): boolean {
    if (this.addZoningInformationForm.invalid) {
      return false;
    }

    if (+this.newZoningInformation.ward.id === 0 ||
      +this.newZoningInformation.drawingType.id === 0 ||
      +this.newZoningInformation.certificate.id === 0) {
      return false;
    }

    const lengthCoors = this.newZoningInformation.informationCoordinates.length;
    if (lengthCoors < 4) {
      return false;
    }

    const firstCoor = this.newZoningInformation.informationCoordinates[0];
    const lastCoor = this.newZoningInformation.informationCoordinates[lengthCoors - 1];
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
    this.zoningInformationService.save(this.newZoningInformation).subscribe(res => this.saveZoningInformationCompleted(res));
  }

  private saveZoningInformationCompleted(res: ResponseModel<ZoningInformationFullModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.hasResult = true;
    this.saveCompleted.emit();
    this.newZoningInformation = new ZoningInformationFullModel(res.result);
  }
}
