import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginModel} from '../../data-services/login.model';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {SizeModel} from '../../data-services/schema/size.model';
import {CategoryModel} from '../../data-services/schema/category.model';
import {PermissionModel} from '../../data-services/schema/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends StoreBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/permission/find-all');
  }
}
