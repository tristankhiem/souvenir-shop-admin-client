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
  selector: 'app-add-size',
  templateUrl: './add-size.component.html'
})
export class AddSizeComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private sizeService: SizeService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addSizeModalWrapper', {static: true}) addSizeModalWrapper: ModalWrapperComponent;
  @ViewChild('addSizeForm', {static: true}) addSizeForm: NgForm;

  public size: SizeModel = new SizeModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addSizeModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.addSizeModalWrapper.show();

  }

  public hide(): void {
    this.addSizeForm.onReset();
    this.addSizeModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.size = new SizeModel();
    this.addSizeForm.onReset();
  }

  public isValid(): boolean {
    if (this.addSizeForm.invalid){
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
    this.sizeService.save(this.size).subscribe(res => this.saveSizeCompleted(res));
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
