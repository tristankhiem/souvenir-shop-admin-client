import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {RoleModel} from '../../data-services/schema/role.model';
import {RoleService} from '../../services/store/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private roleService: RoleService
  ){
  }

  @ViewChild('dataTableSize', {read: ElementRef}) dataTableSize: ElementRef;

  public search: BaseSearchModel<RoleModel[]> = new BaseSearchModel<RoleModel[]>();

  ngOnInit(): void {
    this.getRoles();
  }

  public onChangeDataEvent(search?: BaseSearchModel<RoleModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getRoles(this.dataTableSize.nativeElement);
  }

  private getRoles(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.roleService.search(this.search).subscribe(res => this.getRolesCompleted(res, targetLoading));
  }

  private getRolesCompleted(res: ResponseModel<BaseSearchModel<RoleModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  public openDeleteModal(category: RoleModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa quyền "${category.name}"?`, 'Xóa quyền', true)
      .subscribe(res => this.confirmDeleteRole(res, category));
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
