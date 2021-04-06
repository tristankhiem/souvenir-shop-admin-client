import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ZoningTypeModel} from '../../data-services/zoning-type.model';

@Injectable({
  providedIn: 'root'
})
export class ZoningTypeService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/zoning-type/findAll', {});
  }

  public find(search: BaseSearchModel<ZoningTypeModel[]>): Observable<any> {
    return this.post('/api/v1/zoning-type/findAll', search);
  }
}
