import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawingTypeService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/drawing-type/findAll', {});
  }
}
