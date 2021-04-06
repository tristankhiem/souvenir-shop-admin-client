import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WardModel} from '../../../../data-services/ward.model';
import {HTTP_CODE_CONSTANT} from '../../../../constants/http-code.constant';
import {CertificateService} from '../../../../services/district/certificate.service';
import {WardService} from '../../../../services/district/ward.service';
import {AppAlert, AppLoading} from '../../../../utils';
import {coordinateExtensions} from '../../../../constants/accept-files.constant';
import {DrawingTypeService} from '../../../../services/district/drawing-type.service';
import {ResponseModel} from '../../../../data-services/response.model';
import {NgForm} from '@angular/forms';
import {ZoningSearchService} from '../../../../services/district/zoning-search.service';
import {ZoningSearchFullModel} from '../../../../data-services/zoning-search-full.model';
import {SearchCoordinateModel} from '../../../../data-services/search-coordinate.model';

declare var readXlsxFile: any;
declare var $: any;

@Component({
  selector: 'app-zoning-search',
  templateUrl: './zoning-search.component.html'
})
export class ZoningSearchComponent implements OnInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private wardService: WardService,
    private drawingTypeService: DrawingTypeService,
    private certificateService: CertificateService,
    private zoningSearchService: ZoningSearchService
  ) {
  }

  @ViewChild('zoningSearchForm', {static: true}) zoningSearchForm: NgForm;
  @ViewChild('uploadCoordinateSearchInput', {read: ElementRef}) uploadCoordinateSearchInput: ElementRef;

  public zoningSearch: ZoningSearchFullModel;
  public wards: WardModel[] = [];
  public hasResult = false;

  private countRequest: number;

  ngOnInit(): void {
    this.onInit();
    this.loadData();
  }

  public onInit(): void {
    this.zoningSearch = new ZoningSearchFullModel();
    this.zoningSearch.ward.id = 0;

    const arrCoordinate = ['', '', '', ''].map((coor, index) => {
      const tempCoor = new SearchCoordinateModel();
      tempCoor.id = index;
      return tempCoor;
    });
    this.zoningSearch.searchCoordinates = arrCoordinate;
  }

  public addCoordinate(): void {
    const tempCoordinate = new SearchCoordinateModel();

    const sizeCoors = this.zoningSearch.searchCoordinates.length;
    tempCoordinate.id = sizeCoors ? this.zoningSearch.searchCoordinates[sizeCoors - 1].id + 1 : 0;

    this.zoningSearch.searchCoordinates.push(tempCoordinate);
  }

  public removeCoordinate(tempId: number): void {
    const indexCoor = this.zoningSearch.searchCoordinates.findIndex(coor => +coor.id === +tempId);
    this.zoningSearch.searchCoordinates.splice(indexCoor, 1);
  }

  public uploadCoordinate(event: Event): void {
    const uploadInput: HTMLInputElement = event.target as HTMLInputElement;

    if (!uploadInput.files[0]) {
      return;
    }

    const fileName = uploadInput.files[0].name.split('.');
    const isValidExtension = coordinateExtensions.findIndex(ext => ext === fileName[fileName.length - 1]);

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

      this.zoningSearch.searchCoordinates = arrCoordinates.map((coor, index) => {
        const tempCoor = new SearchCoordinateModel();
        tempCoor.id = index;
        tempCoor.xcoordinate = coor[0];
        tempCoor.ycoordinate = coor[1];

        return tempCoor;
      });

      this.alert.success('Tải thành công');
      this.uploadCoordinateSearchInput.nativeElement.value = '';
    });
  }

  public isCoordinatesValid(): boolean {
    const lengthCoors = this.zoningSearch.searchCoordinates.length;
    if (lengthCoors < 4) {
      return false;
    }

    const firstCoor = this.zoningSearch.searchCoordinates[0];
    const lastCoor = this.zoningSearch.searchCoordinates[lengthCoors - 1];
    if (!firstCoor.xcoordinate || !firstCoor.ycoordinate ||
      !lastCoor.xcoordinate || !lastCoor.ycoordinate ||
      firstCoor.xcoordinate !== lastCoor.xcoordinate ||
      firstCoor.ycoordinate !== lastCoor.ycoordinate) {
      return false;
    }

    return true;
  }

  public isValid(): boolean {
    if (this.zoningSearchForm.invalid) {
      return false;
    }

    if (+this.zoningSearch.ward.id === 0 ||
      +this.zoningSearch.zoningSearchHistory.drawingType.id === 0 ||
      +this.zoningSearch.zoningSearchHistory.certificate.id === 0) {
      return false;
    }

    if (!this.isCoordinatesValid()) {
      return false;
    }
    if ($('#searchBtn').hasOwnProperty('disabled') === false){
      $('#searchBtn').tooltip('disable').tooltip('hide');
    }
    return true;
  }

  public onSave(): void {
    if (!this.isValid()) {
      return;
    }

    this.saveSearchZoning();
  }

  private loadData(): void {
    this.countRequest = 1;
    this.loading.show();
    this.getWards();
  }

  private loadDataCompleted(): void {
    --this.countRequest;

    if (this.countRequest === 0) {
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

  private saveSearchZoning(): void {
    this.loading.show();
    this.zoningSearchService.save(this.zoningSearch).subscribe(res => this.saveSearchZoningCompleted(res));
  }

  private saveSearchZoningCompleted(res: ResponseModel<ZoningSearchFullModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.hasResult = true;
    this.zoningSearch = res.result;
  }
}
