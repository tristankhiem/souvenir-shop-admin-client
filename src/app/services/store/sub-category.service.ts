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
    return this.post('/api/subcategory/search', search);
  }

  public getLikeName(name: string): Observable<any> {
    return this.get('/api/subcategory/get-like-name/' + name);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/subcategory/' + id);
  }

  public save(subCategory: SubCategoryModel): Observable<any> {
    return this.post('/api/subcategory/insert', subCategory);
  }

  public update(subCategory: SubCategoryModel): Observable<any> {
    return this.put('/api/subcategory/update', subCategory);
  }

  public deleteSubCategory(id: number): Observable<any> {
    return this.delete('/api/subcategory/delete/' + id);
  }
}
