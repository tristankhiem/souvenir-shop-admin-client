import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginModel} from '../../data-services/login.model';
import {DistrictBaseService} from '../generic/district-base.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAuthService extends DistrictBaseService {
  public login(login: LoginModel): Observable<any> {
    return this.post('/api/v1/auth/login', login);
  }
}
