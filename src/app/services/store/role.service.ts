import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {RoleModel} from '../../data-services/schema/role.model';
import {RoleFullModel} from '../../data-services/schema/role-full.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends StoreBaseService {
  public search(search: BaseSearchModel<RoleModel[]>): Observable<any> {
    return this.post('/api/v1/role/findAll', search);
  }

  public getLikeName(name: string): Observable<any> {
    return this.get('/api/v1/role/get-like-name/', {name});
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/v1/role/' + id);
  }

  public save(role: RoleFullModel): Observable<any> {
    return this.post('/api/v1/role/insert', role);
  }

  public update(role: RoleFullModel): Observable<any> {
    return this.put('/api/v1/role/update', role);
  }

  public deleteRole(id: number): Observable<any> {
    return this.delete('/api/v1/role/delete', {id});
  }
}
