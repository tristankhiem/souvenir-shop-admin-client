import {GenericWebsocket} from './generic-websocket';
import {environment} from '../../../../environments/environment';

export class CustomerWebsocket extends GenericWebsocket{
  constructor(connectString: string) {
    const connections = environment.customerBaseUrl + connectString;
    super(connections);
  }

  public close(): void {
    this.sock.close();
  }
}

