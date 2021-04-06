export class NotificationModel {
  public id: number;
  public message: string;
  public notifyDate: string;
  public employeeId: string;
  public isRead: boolean;
  public path: string;

  constructor(data?: NotificationModel) {
    const notification = data == null ? this : data;

    this.id = notification.id;
    this.message = notification.message;
    this.notifyDate = notification.notifyDate;
    this.employeeId = notification.employeeId;
    this.isRead = notification.isRead;
    this.path = notification.path;
  }
}
