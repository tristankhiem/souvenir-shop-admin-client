import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends DistrictBaseService {
  public getTodayNotifications(): Observable<any> {
    return this.get('/api/v1/notification/today-notifications', {});
  }
  public updateStatus(notificationId: number): Observable<any> {
    return this.put('/api/v1/notification/update-status/' + notificationId);
  }
}
