import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {CustomerGroupService} from '../../../services/customer/customer-group.service';
import {CustomerGroupFullModel} from '../../../data-services/customer-group-full.model';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {CustomerGrantPermissionModel} from '../../../data-services/customer-grant-permission.model';
import {CustomerGroupModel} from '../../../data-services/customer-group.model';
import {CustomerPermissionModel} from '../../../data-services/customer-permission.model';
import {ColorService} from '../../../services/store/color.service';
import {ColorModel} from '../../../data-services/schema/color.model';

declare var $: any;

@Component({
  selector: 'app-update-color',
  templateUrl: './update-color.component.html'
})
export class UpdateColorComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private colorService: ColorService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateColorModalWrapper', {static: true}) updateColorModalWrapper: ModalWrapperComponent;
  @ViewChild('updateColorForm', {static: true}) updateColorForm: NgForm;

  public color: ColorModel = new ColorModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateColorModalWrapper.id} .modal-dialog`);
  }

  public show(color: ColorModel, event: Event): void {
    event.preventDefault();;
    this.getColor(color.id);
    this.updateColorModalWrapper.show();

  }

  public hide(): void {
    this.updateColorForm.onReset();
    this.updateColorModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.color = new CustomerGroupFullModel();
    this.updateColorForm.onReset();
  }

  private getColor(id: number): void{
    this.loading.show();
    this.colorService.getById(id).subscribe(res => this.getColorCompleted(res));
  }

  private getColorCompleted(res: ResponseModel<ColorModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.color = res.result;
  }

  public isValid(): boolean{
    if (this.updateColorForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveColor();
  }

  private saveColor(): void {
    this.loading.show(this.targetModalLoading);
    this.colorService.update(this.color).subscribe(res => this.saveColorCompleted(res));
  }

  private saveColorCompleted(res: ResponseModel<ColorModel>): void {
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
