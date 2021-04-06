import {Injectable} from '@angular/core';
import {DistrictWebsocket} from './generic/district-websocket';

@Injectable({
  providedIn: 'root'
})
export class EmployeeWaitingNotificationService extends DistrictWebsocket{
  constructor() {
    super('/websocket/employee-waiting-notification');
  }

  public setOnOpen(onOpen: any): void {
    this.sock.onopen  = onOpen;
  }

  public setOnMessage(onMessage: any): void {
    this.sock.onmessage = onMessage;
  }

  public setOnClose(onClose: any): void {
    this.sock.onclose = onClose;
  }
}
