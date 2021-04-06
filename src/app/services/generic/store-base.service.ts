import {Injectable} from '@angular/core';
import {GenericService} from './generic.service';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

const BASE_URL = environment.storeBaseUrl;

@Injectable()
export class StoreBaseService extends GenericService {
  protected get(url: string, body?: object): Observable<any> {
    return  this.http.get(BASE_URL + url, {
      params: this.getParams(body)
    });
  }

  protected post(url: string, body: object): Observable<any> {
    return this.http.post(BASE_URL + url, body);
  }

  protected put(url: string, body?: object): Observable<any> {
    return this.http.put(BASE_URL + url, body);
  }

  protected delete(url: string, body?: object): Observable<any> {
    return this.http.delete(BASE_URL + url, {
      params: this.getParams(body)
    });
  }

  protected uploadFile(url: string, files: File | File[], body?: object): Observable<any> {
    const formData = new FormData();
    if (files instanceof File) {
      formData.append('file', files, files.name);
    }
    else {
      for (const file of files) {
        formData.append('files', file, file.name);
      }
    }

    // add the data object
    const data = body ? JSON.stringify(body) : '';
    formData.append('data', data);

    return this.http.post<any>(BASE_URL + url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
