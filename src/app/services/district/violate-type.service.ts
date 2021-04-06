import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ViolateTypeModel} from '../../data-services/violate-type.model';

@Injectable({
  providedIn: 'root'
})
export class ViolateTypeService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/violate-type/findAll', {});
  }

  public find(search: BaseSearchModel<ViolateTypeModel[]>): Observable<any> {
    return this.post('/api/v1/violate-type/findAll', search);
  }
}
