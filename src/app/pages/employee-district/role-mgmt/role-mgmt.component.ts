import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../../utils';
import {BaseSearchModel} from '../../../data-services/search/base-search.model';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {RoleModel} from '../../../data-services/role.model';
import {RoleService} from '../../../services/district/role.service';

@Component({
  selector: 'app-role-mgmt',
  templateUrl: './role-mgmt.component.html'
})
export class RoleMgmtComponent implements OnInit {

  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private roleService: RoleService
  ){}

  @ViewChild('dataTableRole', {read: ElementRef}) dataTableRole: ElementRef;

  public search: BaseSearchModel<RoleModel[]> = new BaseSearchModel<RoleModel[]>();

  ngOnInit(): void {
    this.getRole();
  }

  public onChangeDataEvent(search?: BaseSearchModel<RoleModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getRole(this.dataTableRole.nativeElement);
  }

  private getRole(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.roleService.find(this.search).subscribe(res => this.getRoleCompleted(res, targetLoading));
  }

  private getRoleCompleted(res: ResponseModel<BaseSearchModel<RoleModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(role: RoleModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa chức vụ "${role.name}"?`, 'Xóa chức vụ', true)
      .subscribe(res => this.confirmDeleteRole(res, role));
  }

  private confirmDeleteRole(state: boolean, role: RoleModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.roleService.deleteRole(role.id).subscribe(res => this.deleteRoleCompleted(res));
  }

  private deleteRoleCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }
}
