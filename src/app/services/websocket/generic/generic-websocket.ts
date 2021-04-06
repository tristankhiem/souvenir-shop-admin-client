declare var SockJS: any;

export class GenericWebsocket {
  protected sock: any;
  private connections: string;

  constructor(connectString: string) {
    if (this.sock) {
      this.sock.close();
    }

    this.connections = connectString;
    this.sock = new SockJS(this.connections);
  }
}
