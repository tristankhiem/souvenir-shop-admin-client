import {Injectable} from '@angular/core';
import {FileConfigModel} from '../data-components/file-config.model';
import {FilesModel} from '../data-components/files.model';
import {FileStatusEnum} from '../enums/file-status.enum';

@Injectable({
  providedIn: 'root'
})
export class AppValidation {
  public validatePassword(pass: string): boolean {
    const pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
    return pattern.test(pass);
  }

  public getRegExp(extensions: string): RegExp {
    return new RegExp(`(.*?)\.(${extensions})$`);
  }

  public validateFiles(filesArray: File[], config: FileConfigModel): FilesModel {
    const maxFilesCount = config.maxFilesCount;
    const totalFilesSize = config.totalFilesSize;
    const acceptExtensions = config.acceptExtensions;

    if (filesArray.length > maxFilesCount) {
      return {
        status: FileStatusEnum.STATUS_MAX_FILES_COUNT_EXCEED,
        files: filesArray
      } as FilesModel;
    }

    const filesWithExceedSize = filesArray.filter((file: File) => file.size > config.maxFileSize);
    if (filesWithExceedSize.length) {
      return {
        status: FileStatusEnum.STATUS_MAX_FILE_SIZE_EXCEED,
        files: filesWithExceedSize
      } as FilesModel;
    }

    let filesSize = 0;
    filesArray.forEach((file: File) => filesSize += file.size);
    if (filesSize > totalFilesSize) {
      return {
        status: FileStatusEnum.STATUS_MAX_FILES_TOTAL_SIZE_EXCEED,
        files: filesArray
      } as FilesModel;
    }

    const filesNotMatchExtensions = filesArray.filter((file: File) => {
      const extensionsList = (acceptExtensions as string)
        .split(', ')
        .map(extension => extension.slice(1))
        .join('|');

      const regexp = this.getRegExp(extensionsList);

      return !regexp.test(file.name);
    });

    if (filesNotMatchExtensions.length) {
      return {
        status: FileStatusEnum.STATUS_NOT_MATCH_EXTENSIONS,
        files: filesNotMatchExtensions
      } as FilesModel;
    }

    return {
      status: FileStatusEnum.STATUS_SUCCESS,
      files: filesArray
    } as FilesModel;
  }

  public isNumeric(val: string): boolean {
    return /^-{0,1}\d+$/.test(val);
  }
}
