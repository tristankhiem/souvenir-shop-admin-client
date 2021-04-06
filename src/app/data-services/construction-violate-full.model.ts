import {ConstructionViolateModel} from './construction-violate.model';
import {ConstructionViolateDocumentModel} from './construction-violate-document.model';

export class ConstructionViolateFullModel extends ConstructionViolateModel{
  public constructionViolateDocuments: ConstructionViolateDocumentModel[];
  public constructor(
    data?: ConstructionViolateFullModel
  ) {
    super(data);
    const constructionViolateFull = data == null ? this : data;

    const constructionViolateDocuments = constructionViolateFull.constructionViolateDocuments || [];
    this.constructionViolateDocuments = [];
    for (const document of constructionViolateDocuments) {
      this.constructionViolateDocuments.push(new ConstructionViolateDocumentModel(document));
    }
  }
}
