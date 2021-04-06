import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ZoningInformationModel} from '../../data-services/zoning-information.model';
import {ZoningInformationFullModel} from '../../data-services/zoning-information-full.model';

@Injectable({
  providedIn: 'root'
})
export class ZoningInformationService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/zoning-information/findAll/');
  }

  public find(search: BaseSearchModel<ZoningInformationModel[]>): Observable<any> {
    return this.post('/api/v1/zoning-information/findAll/', search);
  }

  public getZoningInformation(zoningInformationId: number): Observable<any> {
    return this.get('/api/v1/zoning-information/' + zoningInformationId);
  }

  public save(zoningInformation: ZoningInformationFullModel): Observable<any> {
    return this.post('/api/v1/zoning-information/insert', zoningInformation);
  }

  public update(zoningInformation: ZoningInformationFullModel): Observable<any> {
    return this.put('/api/v1/zoning-information/update', zoningInformation);
  }

  public deleteZoningInformation(zoningInformationId: number): Observable<any> {
    return this.delete('/api/v1/zoning-information/delete/' + zoningInformationId);
  }
}
