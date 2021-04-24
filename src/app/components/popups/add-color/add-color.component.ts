import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {ColorService} from '../../../services/store/color.service';
import {ColorModel} from '../../../data-services/schema/color.model';

declare var $: any;

@Component({
  selector: 'app-add-color',
  templateUrl: './add-color.component.html'
})
export class AddColorComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private colorService: ColorService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addColorModalWrapper', {static: true}) addColorModalWrapper: ModalWrapperComponent;
  @ViewChild('addColorForm', {static: true}) addColorForm: NgForm;

  public color: ColorModel = new ColorModel();

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addColorModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.addColorModalWrapper.show();

  }

  public hide(): void {
    this.addColorForm.onReset();
    this.addColorModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.color = new ColorModel();
    this.addColorForm.onReset();
  }

  public isValid(): boolean {
    if (this.addColorForm.invalid){
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
    this.colorService.save(this.color).subscribe(res => this.saveColorCompleted(res));
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
