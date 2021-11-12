import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {SizeModel} from '../../data-services/schema/size.model';

@Injectable({
  providedIn: 'root'
})
export class SizeService extends StoreBaseService {
  public search(search: BaseSearchModel<SizeModel[]>): Observable<any> {
    return this.post('/api/v1/size/search', search);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/v1/size/get-by-id/' + id);
  }
  public getLikeName(name: string): Observable<any> {
    return this.get('/api/v1/size/get-like-name/', {name});
  }
  public save(size: SizeModel): Observable<any> {
    return this.post('/api/v1/size/insert', size);
  }

  public update(size: SizeModel): Observable<any> {
    return this.put('/api/v1/size/update', size);
  }

  public deleteSize(id: number): Observable<any> {
    return this.delete('/api/v1/size/delete/' + id);
  }
}
