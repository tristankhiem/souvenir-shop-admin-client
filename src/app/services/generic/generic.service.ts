import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DownloadModel} from '../../data-services/download.model';


@Injectable()
export class GenericService {
  constructor(
    protected http: HttpClient
  ) {}

  public saveFile(download: DownloadModel): void {
    const blob = new Blob([this.byteToArrayBuffer(download.data)], { type: download.contentType });

    if (window.navigator.msSaveBlob) {      // IE 11
      window.navigator.msSaveBlob(blob, download.fileName);
    } else {
      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(blob);
      link.download = download.fileName;
      link.click();
    }
  }

  protected getParams(body: object): HttpParams {
    let params = new HttpParams();
    if (body) {
      Object.keys(body).forEach((item) => {
        params = params.set(item, body[item]);
      });
    }

    return params;
  }

  private byteToArrayBuffer(byte: string): Uint8Array {
    const binaryString = window.atob(byte);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
}
