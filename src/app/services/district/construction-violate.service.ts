import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ConstructionViolateModel} from '../../data-services/construction-violate.model';
import {ConstructionViolateFullModel} from '../../data-services/construction-violate-full.model';

@Injectable({
  providedIn: 'root'
})
export class ConstructionViolateService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/construction-violate/findAll', {});
  }

  public find(search: BaseSearchModel<ConstructionViolateModel[]>): Observable<any> {
    return this.post('/api/v1/construction-violate/findAll', search);
  }

  public findByWard(search: BaseSearchModel<ConstructionViolateModel[]>, wardId: number): Observable<any> {
    return this.post('/api/v1/construction-violate/getByWard/' + wardId, search);
  }

  public getConstructionViolate(constructionViolateId: number): Observable<any> {
    return this.get('/api/v1/construction-violate/' + constructionViolateId);
  }

  public save(constructionViolate: ConstructionViolateModel): Observable<any> {
    return this.post('/api/v1/construction-violate/insert', constructionViolate);
  }

  public update(constructionViolate: ConstructionViolateFullModel): Observable<any> {
    return this.put('/api/v1/construction-violate/update', constructionViolate);
  }

  public updateStatus(constructionViolate: ConstructionViolateFullModel): Observable<any> {
    return this.put('/api/v1/construction-violate/update-status', constructionViolate);
  }
}
