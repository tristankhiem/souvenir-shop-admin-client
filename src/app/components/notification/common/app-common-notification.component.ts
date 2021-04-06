import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {CommonNotificationService} from '../../../services';
import {WebsocketModel} from '../../../data-services/websocket.model';
import {CurrentUserService} from '../../../services/district/current-user.service';
import {NOTIFICATION_CODE} from '../../../constants/notification-code.constant';
import {CommonNotificationModel} from '../../../data-services/common-notification.model';
import {NotificationModel} from '../../../data-services/notification.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {ResponseModel} from '../../../data-services/response.model';
import {NotificationService} from '../../../services/district/notification.service';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-common-notification',
  templateUrl: './app-common-notification.component.html'
})
export class AppCommonNotificationComponent implements AfterViewInit {
  public newNotifications: CommonNotificationModel[] = [];
  public notifications: CommonNotificationModel[] = [];
  public initialNotifications: NotificationModel[] = [];
  public districtUrl: string;
  private badgeEl: any;

  constructor(
    private root: ElementRef,
    private alert: AppAlert,
    private loading: AppLoading,
    private router: Router,
    private currentUserService: CurrentUserService,
    private commonNotificationService: CommonNotificationService,
    private notificationService: NotificationService
  ) {
    this.districtUrl = environment.districtUrl;
    this.loadNotification();
    this.commonNotificationService.setOnMessage((notification: WebsocketModel) => {
      this.updateNotificationMessage(notification);
    });
  }

  ngAfterViewInit(): void {
    const elementRf = $(this.root.nativeElement.querySelector('#app_common_notification'));
    this.badgeEl = $(this.root.nativeElement.querySelector('#app_common_notification .badge-warning'));
    this.badgeEl.hide();

    setTimeout(() => {
      if (this.newNotifications.length > 0) {
        this.badgeEl.show();
      }
    }, 250);
    // bind event
    elementRf.on('shown.bs.dropdown', () => {
      this.badgeEl.hide();
    });
    elementRf.on('hidden.bs.dropdown', () => {
      const temp = [];
      for (const item of this.newNotifications) {
        temp.push(item);
      }
      for (const item of this.notifications) {
        temp.push(item);
      }
      this.notifications = temp;
      this.newNotifications = [];
    });
  }

  public updateStatus(notification: CommonNotificationModel): void {
    this.notificationService.updateStatus(notification.id).subscribe(res => this.updateStatusComplete(res, notification.path));
  }

  private updateStatusComplete(res: ResponseModel<any>, path: string): void {
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      return;
    }
    this.router.navigateByUrl(path);
  }

  private loadNotification(): void {
    // this.loading.show();
    // this.notificationService.getTodayNotifications().subscribe(res => this.loadNotificationComplete(res));
  }

  private loadNotificationComplete(res: ResponseModel<NotificationModel[]>): void {
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }
    this.initialNotifications = res.result;
    this.notificationHandle();
  }

  private notificationHandle(): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.initialNotifications.length; i++) {
      console.log(this.initialNotifications[i].id);
      const item = new CommonNotificationModel();
      const prefix = this.initialNotifications[i].message;
      item.id = this.initialNotifications[i].id;
      item.iconClass = 'fa-file';
      item.message = prefix;
      item.path = this.initialNotifications[i].path;
      if (!this.initialNotifications[i].isRead) {
        this.newNotifications.push(item);
      } else {
        this.notifications.push(item);
      }
    }
    this.loading.hide();
  }

  private updateNotificationMessage(notification: WebsocketModel): void {
    const results = notification.data ? notification.data.split(NOTIFICATION_CODE.SEPARATE_CHAR) : [];
    if (results.length < 2) {
      return;
    }

    switch (results[0]) {
      case NOTIFICATION_CODE.NEW_VIOLATE_REQUEST:
        if (this.currentUserService.getPermissions().includes('CONSTRUCTION_VIOLATE_MANAGEMENT')) {
          this.violateRequestHandle(notification.timeStamp.toString());
        }
        break;
    }

    if (this.newNotifications.length > 0) {
      this.badgeEl.show();
    }
  }

  private violateRequestHandle(time: string): void {
    const item = new CommonNotificationModel();
    const prefix = `Yêu cầu xử lý vi phạm mới`;
    item.iconClass = 'fa-file';
    item.time = time;
    item.message = prefix;

    this.newNotifications.push(item);
  }
}
