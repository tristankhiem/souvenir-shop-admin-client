import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginModel} from '../../data-services/login.model';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {SizeModel} from '../../data-services/schema/size.model';
import {CategoryModel} from '../../data-services/schema/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends StoreBaseService {
  public search(search: BaseSearchModel<CategoryModel[]>): Observable<any> {
    return this.post('/api/category/search', search);
  }

  public getLikeName(name: string): Observable<any> {
    return this.get('/api/category/get-like-name/' + name);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/category/' + id);
  }

  public save(category: CategoryModel): Observable<any> {
    return this.post('/api/category/insert', category);
  }

  public update(category: CategoryModel): Observable<any> {
    return this.put('/api/category/update', category);
  }

  public deleteCategory(id: number): Observable<any> {
    return this.delete('/api/category/delete/' + id);
  }
}
