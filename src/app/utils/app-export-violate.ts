import {EventEmitter, Injectable} from '@angular/core';
import {ConstructionViolateFullModel} from '../data-services/construction-violate-full.model';
import {environment} from '../../environments/environment';
import {AppCommon} from './app-common';
import {AppAlert} from './app-alert';
import {DownloadFileService} from '../services/district/download-file.service';

declare var PizZipUtils: any;
declare var docxtemplater: any;
declare var PizZip: any;
declare var saveAs: any;

@Injectable({
  providedIn: 'root'
})
export class AppExportViolate {
  constructor(
    private common: AppCommon,
    private alert: AppAlert,
    private downloadFileService: DownloadFileService,
  ){
  }

  public exportTemplateFile(currentConstructionViolate: ConstructionViolateFullModel, fileName: string): EventEmitter<any> {
    const completedEvent = new EventEmitter<boolean>();
    this.loadFile(environment.districtUrl + `/assets/document/${fileName}.docx`, (error, content) => {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new docxtemplater().loadZip(zip);
      doc.setData(this.setDataDoc(currentConstructionViolate));

      // render docx
      try {
        doc.render();
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }); // Output the document using Data-URI

        saveAs(out, `${fileName}-${new Date().toLocaleDateString('en-GB')}.docx`);
        this.alert.success('Xuất văn bản thành công');
      } catch (error) {
        console.error(error);
      }

      // Export completed
      completedEvent.emit(true);
    });
    return completedEvent;
  }

  public exportPdfFile(fileName: string): EventEmitter<any> {
    const completedEvent = new EventEmitter<boolean>();

    const url = environment.districtUrl + `/assets/document/${fileName}.pdf`;

    this.downloadFileService.download(url, { responseType: 'blob' })
      .subscribe((response: Blob) => {
      saveAs(response, `${fileName}-${new Date().toLocaleDateString('en-GB')}.pdf`);
      this.alert.success('Xuất văn bản thành công');
      completedEvent.emit(true);
    });

    return completedEvent;
  }

  private setDataDoc(currentConstructionViolate: ConstructionViolateFullModel): any {
    return {
      investorName: currentConstructionViolate.investorName,
      violateAddress: currentConstructionViolate.violateAddress,
      permanentAddress: currentConstructionViolate.permanentAddress,
      ward: currentConstructionViolate.ward.name,
      year: new Date(currentConstructionViolate.investorBirthDate).getFullYear(),
      investorCardId: currentConstructionViolate.investorCardId,
      investorCardDate: new Date(currentConstructionViolate.investorCardDate).toLocaleDateString('en-GB'),
      cardIdProvider: currentConstructionViolate.cardIdProvider,
      reportNumber: currentConstructionViolate.reportNumber,
      reportCreatedDate: new Date(currentConstructionViolate.reportCreatedDate).toLocaleDateString('en-GB'),
      wardDocumentNumber: currentConstructionViolate.wardDocumentNumber,
      wardDocumentCreatedDate: new Date(currentConstructionViolate.wardDocumentCreatedDate).toLocaleDateString('en-GB'),
      certificateNumber: currentConstructionViolate.certificateNumber,
      certificateDate: new Date(currentConstructionViolate.certificateDate).toLocaleDateString('en-GB'),
      certificateProvider: currentConstructionViolate.certificateProvider,
      fine: currentConstructionViolate.fine,
      fineString: this.common.moneyToString(currentConstructionViolate.fine),
      violateArea: currentConstructionViolate.violateArea,
      violateDetail: currentConstructionViolate.violateDetail,
      violateDate: new Date(currentConstructionViolate.violateDate).toLocaleDateString('en-GB'),
      currentStatus: currentConstructionViolate.currentStatus,
      structure: currentConstructionViolate.structure,
      violateReceiptId: currentConstructionViolate.violateReceiptId,
      violateReceiptDate: new Date(currentConstructionViolate.violateReceiptDate).toLocaleDateString('en-GB'),
      violateType: currentConstructionViolate.violateType.id === 1 ? 'xây dựng sai phép' : 'xây dựng không phép',
      employeeHandle: currentConstructionViolate.employeeHandle.fullName,
      firstReportNumber: (currentConstructionViolate.constructionViolateDocuments == null) ? '' :
        currentConstructionViolate.constructionViolateDocuments[0].documentReportId,
      firstReportDate: (currentConstructionViolate.constructionViolateDocuments == null) ? '' :
        new Date(currentConstructionViolate.constructionViolateDocuments[0].documentReportDate).toLocaleDateString('en-GB'),
      firstReportDateString: (currentConstructionViolate.constructionViolateDocuments == null) ? '' :
        this.toDateString(currentConstructionViolate.constructionViolateDocuments[0].documentReportDate),
      firstDecisionNumber: (currentConstructionViolate.constructionViolateDocuments == null) ? '' :
        currentConstructionViolate.constructionViolateDocuments[0].documentDecisionId,
      firstDecisionDate: (currentConstructionViolate.constructionViolateDocuments == null) ? '' :
        new Date(currentConstructionViolate.constructionViolateDocuments[0].documentDecisionDate).toLocaleDateString('en-GB'),
      firstDecisionDateString: (currentConstructionViolate.constructionViolateDocuments == null) ? '' :
        this.toDateString(currentConstructionViolate.constructionViolateDocuments[0].documentDecisionDate),
      firstReviewNumber: (currentConstructionViolate.constructionViolateDocuments == null) ? '' :
        currentConstructionViolate.constructionViolateDocuments[0].documentReviewId,
      firstReviewDate: (currentConstructionViolate.constructionViolateDocuments == null) ? '' :
        new Date(currentConstructionViolate.constructionViolateDocuments[0].documentReviewDate).toLocaleDateString('en-GB'),
      secondReportNumber: (currentConstructionViolate.constructionViolateDocuments[1] == null) ? '' :
        currentConstructionViolate.constructionViolateDocuments[1].documentReportId,
      secondReportDate: (currentConstructionViolate.constructionViolateDocuments[1] == null) ? '' :
        new Date(currentConstructionViolate.constructionViolateDocuments[1].documentReportDate).toLocaleDateString('en-GB'),
      secondReportDateString: (currentConstructionViolate.constructionViolateDocuments[1] == null) ? '' :
        this.toDateString(currentConstructionViolate.constructionViolateDocuments[1].documentReportDate),
      secondDecisionNumber: (currentConstructionViolate.constructionViolateDocuments[1] == null) ? '' :
        currentConstructionViolate.constructionViolateDocuments[1].documentDecisionId,
      secondDecisionDate: (currentConstructionViolate.constructionViolateDocuments[1] == null) ? '' :
        new Date(currentConstructionViolate.constructionViolateDocuments[1].documentDecisionDate).toLocaleDateString('en-GB'),
      createdDate: new Date(currentConstructionViolate.createdDate).toLocaleDateString('en-GB'),
    };
  }

  private loadFile(path, callback): void {
    PizZipUtils.getBinaryContent(path, callback);
  }

  private toDateString(date: number): string {
    const tempDate = new Date(date);
    return 'ngày ' + tempDate.getDate() + ' tháng ' + (tempDate.getMonth() + 1).toString() + ' năm ' + tempDate.getFullYear();
  }
}
