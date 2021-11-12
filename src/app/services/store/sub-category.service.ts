import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {SubCategoryModel} from '../../data-services/schema/sub-category.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService extends StoreBaseService {
  public search(search: BaseSearchModel<SubCategoryModel[]>): Observable<any> {
    return this.post('/api/v1/sub-category/search', search);
  }

  public getLikeName(name: string): Observable<any> {
    return this.get('/api/v1/sub-category/get-like-name/', {name});
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/v1/sub-category/get-by-id/' + id);
  }

  public save(subCategory: SubCategoryModel): Observable<any> {
    return this.post('/api/v1/sub-category/insert', subCategory);
  }

  public update(subCategory: SubCategoryModel): Observable<any> {
    return this.put('/api/v1/sub-category/update', subCategory);
  }

  public deleteSubCategory(id: number): Observable<any> {
    return this.delete('/api/v1/sub-category/delete/' + id);
  }
}
