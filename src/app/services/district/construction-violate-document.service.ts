import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {ConstructionViolateDocumentModel} from '../../data-services/construction-violate-document.model';

@Injectable({
  providedIn: 'root'
})
export class ConstructionViolateDocumentService extends DistrictBaseService {
  public save(document: ConstructionViolateDocumentModel): Observable<any> {
    return this.post('/api/v1/construction-violate-document/insert', document);
  }

  public deleteDocument(documentId: number): Observable<any> {
    return this.delete('/api/v1/construction-violate-document/delete/' + documentId);
  }
}
