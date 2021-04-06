import {FileStatusEnum} from '../enums/file-status.enum';


export class FilesModel {
  status: FileStatusEnum;
  files: File[];

  constructor(data?: FilesModel) {
    const fileData = data == null ? this : data;
    this.status = fileData.status;

    const fileList = fileData.files || [];
    this.files = [];
    for (const item of fileList) {
      this.files.push(item);
    }
  }
}
