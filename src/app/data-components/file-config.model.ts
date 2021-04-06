export class FileConfigModel {
  public acceptExtensions?: string[] | string = '*';
  public maxFilesCount = 10;
  public maxFileSize = 8024000;
  public totalFilesSize = 80240000;

  constructor(data?: FileConfigModel) {
    const config = data == null ? this : data;
    this.acceptExtensions = config.acceptExtensions;
    this.maxFilesCount = config.maxFilesCount;
    this.maxFileSize = config.maxFileSize;
    this.totalFilesSize = config.totalFilesSize;
  }
}
