import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/certificate/findAll', {});
  }
}
