import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginModel} from '../../data-services/login.model';
import {StoreBaseService} from '../generic/store-base.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAuthService extends StoreBaseService {
  public login(login: LoginModel): Observable<any> {
    return this.post('/api/auth/login', login);
  }
}
