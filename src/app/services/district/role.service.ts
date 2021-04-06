import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {RoleModel} from '../../data-services/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/role/findAll', {});
  }

  public find(search: BaseSearchModel<RoleModel[]>): Observable<any> {
    return this.post('/api/v1/role/findAll', search);
  }

  public getRoleFull(roleId: number): Observable<any> {
    return this.get('/api/v1/role/' + roleId);
  }

  public save(role: RoleModel): Observable<any> {
    return this.post('/api/v1/role/insert', role);
  }

  public update(role: RoleModel): Observable<any> {
    return this.put('/api/v1/role/update', role);
  }

  public deleteRole(roleId: number): Observable<any> {
    return this.delete('/api/v1/role/delete/' + roleId);
  }

  public findAllPermission(): Observable<any> {
    return this.get('/api/v1/role/findAllPermission', {});
  }
}
