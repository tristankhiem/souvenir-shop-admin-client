import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {PermissionModel} from '../../../data-services/schema/permission.model';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {RoleService} from '../../../services/store/role.service';
import {RoleFullModel} from '../../../data-services/schema/role-full.model';
import {GrantPermissionModel} from '../../../data-services/schema/grant-permission.model';
import {PermissionService} from '../../../services/store/permission.service';

declare var $: any;

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html'
})
export class AddRoleComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addRoleModalWrapper', {static: true}) addRoleModalWrapper: ModalWrapperComponent;
  @ViewChild('addRoleForm', {static: true}) addRoleForm: NgForm;

  public roleFull: RoleFullModel = new RoleFullModel();
  public permissionList: PermissionModel[] = [];
  public selectedPermission: PermissionModel[] = [];
  public grantPermission: GrantPermissionModel;

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addRoleModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.loadData();
    this.selectedPermission = [];
    this.addRoleModalWrapper.show();

  }

  public hide(): void {
    this.addRoleForm.onReset();
    this.addRoleModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.roleFull = new RoleFullModel();
    this.addRoleForm.onReset();
  }

  private loadData(): void {
    this.loading.show();
    this.getPermission();
  }

  private getPermission(): void{
    this.permissionService.findAll().subscribe(res => this.getPermissionCompleted(res));
  }

  private getPermissionCompleted(res: ResponseModel<PermissionModel[]>): void {
    this.loading.show();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }
    this.loading.hide();
    this.permissionList = res.result;
  }

  public onCheck(permission: PermissionModel): void{
    for (const item of this.selectedPermission){
      if (permission.code === item.code){
        this.selectedPermission = this.selectedPermission.filter(e => e.code !== item.code);
        return;
      }
    }
    this.selectedPermission.push(permission);
  }

  public isValid(): boolean {
    if (this.addRoleForm.invalid) {
      return false;
    }

    if (this.selectedPermission.length === 0){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }

    this.roleFull.grantPermissions = [];
    for (const item of this.selectedPermission){
      this.grantPermission = new GrantPermissionModel();
      this.grantPermission.permission = item;
      this.roleFull.grantPermissions.push(this.grantPermission);
    }
    this.saveRole();
  }

  private saveRole(): void {
    this.loading.show(this.targetModalLoading);
    this.roleService.save(this.roleFull).subscribe(res => this.saveRoleCompleted(res));
  }

  private saveRoleCompleted(res: ResponseModel<RoleFullModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.saveCompleted.emit();
    this.hide();
  }
}
