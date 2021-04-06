import {Component, ElementRef, ViewChild} from '@angular/core';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {FeedbackViolateModel} from '../../../data-services/feedback-violate.model';
import {AppAlert, AppLoading, AppModals} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {FeedbackViolateService} from '../../../services/district/feedback-violate.service';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';

@Component({
  selector: 'app-view-feedback-violate',
  templateUrl: './view-feedback-violate.component.html'
})
export class ViewFeedbackViolateComponent {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private common: AppCommon,
    private feedbackViolateService: FeedbackViolateService
  ) {
  }

  @ViewChild('viewFeedbackViolateModalWrapper') viewFeedbackViolateModalWrapper: ModalWrapperComponent;

  public feedbackViolate: FeedbackViolateModel = new FeedbackViolateModel();

  private targetModalLoading: ElementRef;

  public show(constructionViolateId: number, event: Event): void {
    event.preventDefault();
    this.feedbackViolate = new FeedbackViolateModel();
    this.loadFeedbackViolate(constructionViolateId);
    this.viewFeedbackViolateModalWrapper.show();
  }

  private loadFeedbackViolate(constructionViolateId: number): void {
    this.loading.show(this.targetModalLoading);
    this.feedbackViolateService.getLatestFeedbackByViolate(constructionViolateId)
      .subscribe(res => this.loadFeedbackViolateCompleted(res));
  }

  private loadFeedbackViolateCompleted(res: ResponseModel<FeedbackViolateModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }
    this.feedbackViolate = res.result;
  }

}
