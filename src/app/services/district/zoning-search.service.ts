import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ZoningSearchModel} from '../../data-services/zoning-search.model';
import {ZoningSearchFullModel} from '../../data-services/zoning-search-full.model';

@Injectable({
  providedIn: 'root'
})
export class ZoningSearchService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/zoning-search/findAll', {});
  }

  public find(search: BaseSearchModel<ZoningSearchModel[]>): Observable<any> {
    return this.post('/api/v1/zoning-search/findAll', search);
  }

  public getZoningSearch(zoningSearchId: number): Observable<any> {
    return this.get('/api/v1/zoning-search/' + zoningSearchId);
  }

  public save(zoningSearch: ZoningSearchFullModel): Observable<any> {
    return this.post('/api/v1/zoning-search/search', zoningSearch);
  }

  public update(zoningSearch: ZoningSearchFullModel): Observable<any> {
    return this.put('/api/v1/zoning-search/update', zoningSearch);
  }

  public deleteZoningSearch(zoningSearchId: number): Observable<any> {
    return this.delete('/api/v1/zoning-search/delete/' + zoningSearchId);
  }
}
