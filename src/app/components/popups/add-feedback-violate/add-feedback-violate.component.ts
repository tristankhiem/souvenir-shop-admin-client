import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {ConstructionViolateFullModel} from '../../../data-services/construction-violate-full.model';
import {AppAlert, AppLoading, AppModals} from '../../../utils';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {AppCommon} from '../../../utils/app-common';
import {FeedbackViolateModel} from '../../../data-services/feedback-violate.model';
import {FeedbackViolateService} from '../../../services/district/feedback-violate.service';
import {NgForm} from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-add-feedback-violate',
  templateUrl: './add-feedback-violate.component.html'
})
export class AddFeedbackViolateComponent implements OnInit, AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private common: AppCommon,
    private feedbackViolateService: FeedbackViolateService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();

  @ViewChild('addFeedbackViolateModalWrapper') addFeedbackViolateModalWrapper: ModalWrapperComponent;
  @ViewChild('addFeedbackViolateForm', {static: true}) addFeedbackViolateForm: NgForm;

  public constructionViolate: ConstructionViolateFullModel = new ConstructionViolateFullModel();
  public feedbackViolate: FeedbackViolateModel = new FeedbackViolateModel();

  private targetModalLoading: ElementRef;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addFeedbackViolateModalWrapper.id} .modal-dialog`);
  }

  public show(event: Event, violate: ConstructionViolateFullModel): void {
    event.stopPropagation();
    event.preventDefault();
    this.constructionViolate = new ConstructionViolateFullModel(violate);
    this.feedbackViolate = new FeedbackViolateModel();
    this.addFeedbackViolateModalWrapper.show();
  }

  public hide(): void {
    this.feedbackViolate = new FeedbackViolateModel();
    this.addFeedbackViolateForm.onReset();
    this.addFeedbackViolateModalWrapper.hide();
  }

  public isValid(): boolean {
    if (this.addFeedbackViolateForm.invalid) {
      return false;
    }
    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveFeedbackViolate();
  }

  private saveFeedbackViolate(): void {
    this.feedbackViolate.constructionViolate.id = this.constructionViolate.id;
    this.loading.show(this.targetModalLoading);
    this.feedbackViolateService.save(this.feedbackViolate).subscribe(res => this.saveFeedbackViolateCompleted(res));
  }

  private saveFeedbackViolateCompleted(res: ResponseModel<FeedbackViolateModel>): void {
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
