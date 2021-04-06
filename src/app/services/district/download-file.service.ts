import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService extends DistrictBaseService {
  public download(url: string, body?: object): Observable<any> {
    return this.http.get(url, body);
  }
}
