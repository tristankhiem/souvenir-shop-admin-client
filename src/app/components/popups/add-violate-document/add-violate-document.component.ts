import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
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
  selector: 'app-add-violate-document',
  templateUrl: './add-violate-document.component.html'
})
export class AddViolateDocumentComponent implements OnInit, AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private common: AppCommon,
    private exportViolate: AppExportViolate,
    private constructionViolateService: ConstructionViolateService,
    private violateDocumentService: ConstructionViolateDocumentService
  ) {
  }

  @Output() updateViolateDocumentEvent = new EventEmitter<ConstructionViolateDocumentModel[]>();

  @ViewChild('addViolateDocumentModalWrapper') addViolateDocumentModalWrapper: ModalWrapperComponent;

  public violate: ConstructionViolateFullModel = new ConstructionViolateFullModel();

  private targetModalLoading: ElementRef;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addViolateDocumentModalWrapper.id} .modal-dialog`);
  }

  public isClickableSecondBtn(): boolean {
    if (!this.violate.constructionViolateDocuments?.length) {
      return false;
    }

    if (!this.violate.constructionViolateDocuments[0]?.documentReportDate ||
      !this.violate.constructionViolateDocuments[0]?.documentDecisionDate ||
      !this.violate.constructionViolateDocuments[0]?.documentReviewDate) {
      return false;
    }

    return true;
  }

  public show(event: Event, violate: ConstructionViolateFullModel): void {
    event.stopPropagation();
    event.preventDefault();
    this.violate = new ConstructionViolateFullModel(violate);
    this.addViolateDocumentModalWrapper.show();
  }

  public onExportTTHCFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất văn bản tờ trình lần 1?', 'Tờ trình xử phạt hành chính', false).subscribe((state: boolean) => {
      if (!state) {
        return;
      }

      this.loading.show();
      this.constructionViolateService.getConstructionViolate(this.violate.id).subscribe(res => this.exportReportFile(res, 1, 'TTXPVPHC'));
    });
  }

  public onExportTTCCFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isClickableSecondBtn()) {
      return;
    }

    this.modal.confirm('Xác nhận xuất văn bản tờ trình lần 2?', 'Tờ trình xử lý cưỡng chế', false).subscribe((state: boolean) => {
      if (!state) {
        return;
      }

      this.loading.show();
      this.constructionViolateService.getConstructionViolate(this.violate.id).subscribe(res => this.exportReportFile(res, 2, 'TTCC'));
    });
  }

  public exportReportFile(res: ResponseModel<ConstructionViolateFullModel>, times: number, fileName: string): void {
    this.violate = this.handleResponse(res);

    const indexTT = this.violate.constructionViolateDocuments.findIndex(document => document.times === times);

    console.log(this.violate.constructionViolateDocuments);
    if (!this.violate.constructionViolateDocuments[indexTT]?.documentReportDate) {
      this.violate.constructionViolateDocuments[indexTT].documentReportDate = new Date().getTime();
      // Update document date
      this.violateDocumentService.save(this.violate.constructionViolateDocuments[indexTT]).subscribe((resp: ResponseModel<any>) => {
        if (resp.status !== HTTP_CODE_CONSTANT.OK) {
          this.loading.hide();
          this.alert.errorMessages(resp.message);

          this.violate.constructionViolateDocuments[indexTT].documentReportDate = null;
          return;
        }
      });

    }
    // export TT file
    this.exportViolate.exportTemplateFile(this.violate, fileName).subscribe((isCompleted: boolean) => {
      if (!isCompleted) {
        return;
      }

      this.loading.hide();
    });
  }

  public onExportQDHCFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất văn bản quyết định xử phạt hành chính?', 'Quyết định xử phạt hành chính', false)
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.loading.show();
        this.constructionViolateService.getConstructionViolate(this.violate.id)
          .subscribe(res => this.exportDecisionFile(res, 1, 'QDXPVPHC'));
      });
  }

  public onExportQDCCFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất văn bản quyết định xử phạt cưỡng chế?', 'Quyết định xử phạt cưỡng chế', false)
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.loading.show();
        this.constructionViolateService.getConstructionViolate(this.violate.id)
          .subscribe(res => this.exportDecisionFile(res, 2, 'QDCC'));
      });
  }

  public exportDecisionFile(res: ResponseModel<ConstructionViolateFullModel>, times: number, fileName: string): void {
    this.violate = this.handleResponse(res);

    const indexTT = this.violate.constructionViolateDocuments.findIndex(document => document.times === times);

    if (!this.violate.constructionViolateDocuments[indexTT]?.documentReportDate) {
      this.loading.hide();
      this.alert.warn('Vui lòng xuất tờ trình trước!');
      return;
    }

    if (!this.violate.constructionViolateDocuments[indexTT]?.documentDecisionDate) {
      const tempCurrentDate = new Date();
      this.violate.constructionViolateDocuments[indexTT].documentDecisionDate = tempCurrentDate.getTime();
      this.violate.constructionViolateDocuments[indexTT].documentReviewDate = tempCurrentDate.setDate(tempCurrentDate.getDate() + 10);
      // Update document date
      this.violateDocumentService.save(this.violate.constructionViolateDocuments[indexTT]).subscribe((resp: ResponseModel<any>) => {
        if (resp.status !== HTTP_CODE_CONSTANT.OK) {
          this.loading.hide();
          this.alert.errorMessages(resp.message);

          this.violate.constructionViolateDocuments[indexTT].documentDecisionDate = null;
          return;
        }

      });
    }
    // export QD file
    this.exportViolate.exportTemplateFile(this.violate, fileName).subscribe((isCompleted: boolean) => {
      if (!isCompleted) {
        return;
      }

      this.loading.hide();
    });
  }

  public onExportBBHCFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất biên bản phúc tra quyết định xử phạt hành chính?', 'Phúc tra quyết định xử phạt hành chính', false)
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.loading.show();
        this.constructionViolateService.getConstructionViolate(this.violate.id)
          .subscribe(res => this.exportReviewFile(res, 1, 'BB_QDXPVPHC'));
      });
  }

  public onExportBBCCFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.modal.confirm('Xác nhận xuất biên bản phúc tra quyết định xử phạt cưỡng chế?', 'Phúc tra quyết định xử phạt cưỡng chế', false)
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.loading.show();
        this.constructionViolateService.getConstructionViolate(this.violate.id)
          .subscribe(res => this.exportReviewFile(res, 2, 'BB_QDCC'));
      });
  }

  public exportReviewFile(res: ResponseModel<ConstructionViolateFullModel>, times: number, fileName: string): void {
    this.violate = this.handleResponse(res);
    const indexQD = this.violate.constructionViolateDocuments.findIndex(document => document.times === times);

    if (!this.violate.constructionViolateDocuments[indexQD]?.documentDecisionDate) {
      this.loading.hide();
      this.alert.warn('Vui lòng xuất văn bản quyết định trước!');
      return;
    }

    // export BB file
    this.exportViolate.exportPdfFile(fileName).subscribe((isCompleted: boolean) => {
      console.log(isCompleted);
      if (!isCompleted) {
        return;
      }

      this.loading.hide();
    });
  }

  public onNewDocument(): void {
    this.modal.confirm('Xác nhận tạo biên bản?', 'Xác nhận', false).subscribe(res => this.saveNewDocument(res));
  }

  private saveNewDocument(state: boolean): void {
    if (!state) {
      return;
    }

    // init data
    const newDocument = new ConstructionViolateDocumentModel();
    const latestTime = this.violate.constructionViolateDocuments?.length;
    newDocument.times = !latestTime ? 1 : latestTime + 1;
    newDocument.constructionViolate = new ConstructionViolateModel();
    newDocument.constructionViolate.id = this.violate.id;

    this.loading.show(this.targetModalLoading);
    this.violateDocumentService.save(newDocument).subscribe(res => this.saveNewDocumentCompleted(res));
  }

  private saveNewDocumentCompleted(res: ResponseModel<ConstructionViolateDocumentModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.violate.constructionViolateDocuments.push(res.result);
    this.updateViolateDocumentEvent.emit(this.violate.constructionViolateDocuments);
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
