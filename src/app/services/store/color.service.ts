import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginModel} from '../../data-services/login.model';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ColorModel} from '../../data-services/schema/color.model';

@Injectable({
  providedIn: 'root'
})
export class ColorService extends StoreBaseService {
  public search(search: BaseSearchModel<ColorModel[]>): Observable<any> {
    return this.post('/api/color/search', search);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/color/' + id);
  }
  public getLikeName(name: string): Observable<any> {
    return this.get('/api/color/get-like-name/' + name);
  }
  public save(color: ColorModel): Observable<any> {
    return this.post('/api/color/insert', color);
  }

  public update(color: ColorModel): Observable<any> {
    return this.put('/api/color/update', color);
  }

  public deleteColor(id: number): Observable<any> {
    return this.delete('/api/color/delete/' + id);
  }
}