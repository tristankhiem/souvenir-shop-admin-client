import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {ConstructionViolateFullModel} from '../../../data-services/construction-violate-full.model';
import {ConstructionViolateDocumentService} from '../../../services/district/construction-violate-document.service';
import {AppAlert, AppLoading, AppModals} from '../../../utils';
import {ConstructionViolateDocumentModel} from '../../../data-services/construction-violate-document.model';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {ConstructionViolateModel} from '../../../data-services/construction-violate.model';
import {ConstructionViolateService} from '../../../services/district/construction-violate.service';
import {AppCommon} from '../../../utils/app-common';
import {AppExportViolate} from '../../../utils/app-export-violate';

declare var $: any;

@Component({
  selector: 'app-add-violate-other-document',
  templateUrl: './add-violate-other-document.component.html'
})
export class AddViolateOtherDocumentComponent implements OnInit, AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private common: AppCommon,
    private exportViolate: AppExportViolate,
    private constructionViolateService: ConstructionViolateService
  ) {
  }

  @Output() updateViolateOtherDocumentEvent = new EventEmitter<ConstructionViolateDocumentModel[]>();

  @ViewChild('addViolateOtherDocumentModalWrapper') addViolateOtherDocumentModalWrapper: ModalWrapperComponent;

  public violate: ConstructionViolateFullModel = new ConstructionViolateFullModel();

  private targetModalLoading: ElementRef;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addViolateOtherDocumentModalWrapper.id} .modal-dialog`);
  }

  public show(event: Event, violate: ConstructionViolateFullModel): void {
    event.stopPropagation();
    event.preventDefault();
    this.violate = new ConstructionViolateFullModel(violate);
    this.addViolateOtherDocumentModalWrapper.show();
  }

  public onExportPLFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất phiếu phân loại?', 'Xác nhận', false)
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.loading.show();
        this.constructionViolateService.getConstructionViolate(this.violate.id)
          .subscribe(res => this.exportReviewFile(res, 'Phieu_PL'));
      });
  }

  public onExportKSFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất phiếu khảo sát?', 'Xác nhận', false)
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.loading.show();
        this.constructionViolateService.getConstructionViolate(this.violate.id)
          .subscribe(res => this.exportReviewFile(res, 'Phieu_KS'));
      });
  }

  public onExportTMBNFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất thư mời Uỷ ban phường?', 'Xác nhận', false)
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.loading.show();
        this.constructionViolateService.getConstructionViolate(this.violate.id)
          .subscribe(res => this.exportReviewFile(res, 'TM_BN'));
      });
  }

  public onExportTMCDTFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất thư mời chủ đầu tư?', 'Xác nhận', false)
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.loading.show();
        this.constructionViolateService.getConstructionViolate(this.violate.id)
          .subscribe(res => this.exportReviewFile(res, 'TM_CDT'));
      });
  }

  public exportReviewFile(res: ResponseModel<ConstructionViolateFullModel>, fileName: string): void {
    this.violate = this.handleResponse(res);

    // export BB file
    this.exportViolate.exportTemplateFile(this.violate, fileName).subscribe((isCompleted: boolean) => {
      console.log(isCompleted);
      if (!isCompleted) {
        return;
      }

      this.loading.hide();
    });
  }

  private handleResponse(res: ResponseModel<ConstructionViolateFullModel>): ConstructionViolateFullModel {
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.loading.hide();
      this.alert.errorMessages(res.message);
      return;
    }

    return res.result;
  }
}
