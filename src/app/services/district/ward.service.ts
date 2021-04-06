import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {WardModel} from '../../data-services/ward.model';

@Injectable({
  providedIn: 'root'
})
export class WardService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/ward/findAll', {});
  }

  public find(search: BaseSearchModel<WardModel[]>): Observable<any> {
    return this.post('/api/v1/ward/findAll', search);
  }

  public getWard(wardId: number): Observable<any> {
    return this.get('/api/v1/ward/' + wardId);
  }

  public save(ward: WardModel): Observable<any> {
    return this.post('/api/v1/ward/insert', ward);
  }

  public update(ward: WardModel): Observable<any> {
    return this.put('/api/v1/ward/update', ward);
  }

  public deleteWard(wardId: number): Observable<any> {
    return this.delete('/api/v1/ward/delete/' + wardId);
  }
}
