import {environment} from '../../../../environments/environment';
import {GenericWebsocket} from './generic-websocket';

export class DistrictWebsocket extends GenericWebsocket{
  constructor(connectString: string) {
    const connections = environment.districtBaseUrl + connectString;
    super(connections);
  }

  public send(message: string): void {
    this.sock.send(message);
  }

  public close(): void {
    this.sock.close();
  }
}
