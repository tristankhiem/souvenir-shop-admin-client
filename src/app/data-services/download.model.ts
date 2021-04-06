export class DownloadModel {
  public fileName: string;
  public contentType: string;
  public data: string;
  constructor(data?: DownloadModel) {
    const download = data == null ? this : data;
    this.fileName = data.fileName;
    this.contentType = data.contentType;
    this.data = data.data;
  }
}
