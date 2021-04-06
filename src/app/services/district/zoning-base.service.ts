import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ZoningBaseModel} from '../../data-services/zoning-base.model';

@Injectable({
  providedIn: 'root'
})
export class ZoningBaseService extends DistrictBaseService {
  public findAll(zoningTypeId: number): Observable<any> {
    return this.get('/api/v1/zoning-base/findAll/' + zoningTypeId);
  }

  public find(search: BaseSearchModel<ZoningBaseModel[]>, zoningTypeId: number): Observable<any> {
    return this.post('/api/v1/zoning-base/findAll/' + zoningTypeId, search);
  }

  public getZoningBase(zoningBaseId: number): Observable<any> {
    return this.get('/api/v1/zoning-base/' + zoningBaseId);
  }

  public save(zoningBase: ZoningBaseModel): Observable<any> {
    return this.post('/api/v1/zoning-base/insert', zoningBase);
  }

  public update(zoningBase: ZoningBaseModel): Observable<any> {
    return this.put('/api/v1/zoning-base/update', zoningBase);
  }

  public deleteZoningBase(zoningBaseId: number): Observable<any> {
    return this.delete('/api/v1/zoning-base/delete/' + zoningBaseId);
  }
}
