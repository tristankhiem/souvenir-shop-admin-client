import {Injectable} from '@angular/core';

declare var toastr: any;

@Injectable()
export class AppAlert {
  public error(message: string): void {
    toastr.error(message);
  }

  public errorMessages(messages: string[]): void {
    for (const msg of messages) {
      toastr.error(msg);
    }
  }

  public warn(message: string): void {
    toastr.warning(message);
  }

  public info(message: string): void {
    toastr.info(message);
  }

  public success(message: string): void {
    toastr.success(message);
  }

  public successMessages(messages: string[]): void {
    for (const msg of messages) {
      toastr.success(msg);
    }
  }
}
