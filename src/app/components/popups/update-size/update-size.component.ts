import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {SizeService} from '../../../services/store/size.service';
import {SizeModel} from '../../../data-services/schema/size.model';

declare var $: any;

@Component({
  selector: 'app-update-size',
  templateUrl: './update-size.component.html'
})
export class UpdateSizeComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private sizeService: SizeService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateSizeModalWrapper', {static: true}) updateSizeModalWrapper: ModalWrapperComponent;
  @ViewChild('updateSizeForm', {static: true}) updateSizeForm: NgForm;

  public size: SizeModel = new SizeModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateSizeModalWrapper.id} .modal-dialog`);
  }

  public show(size: SizeModel, event: Event): void {
    event.preventDefault();
    this.getSize(size.id);
    this.updateSizeModalWrapper.show();

  }

  public hide(): void {
    this.updateSizeForm.onReset();
    this.updateSizeModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.size = new SizeModel();
    this.updateSizeForm.onReset();
  }

  private getSize(id: number): void{
    this.loading.show();
    this.sizeService.getById(id).subscribe(res => this.getSizeCompleted(res));
  }

  private getSizeCompleted(res: ResponseModel<SizeModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.size = res.result;
  }

  public isValid(): boolean{
    if (this.updateSizeForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveSize();
  }

  private saveSize(): void {
    this.loading.show(this.targetModalLoading);
    this.sizeService.update(this.size).subscribe(res => this.saveSizeCompleted(res));
  }

  private saveSizeCompleted(res: ResponseModel<SizeModel>): void {
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
