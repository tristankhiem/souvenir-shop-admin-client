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
    return this.post('/api/sub-category/search', search);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/sub-category/' + id);
  }

  public save(subCategory: SubCategoryModel): Observable<any> {
    return this.post('/api/sub-category/insert', subCategory);
  }

  public update(subCategory: SubCategoryModel): Observable<any> {
    return this.put('/api/sub-category/update', subCategory);
  }

  public deleteSubCategory(id: number): Observable<any> {
    return this.delete('/api/sub-category/delete/' + id);
  }
}
