import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';

import {RoleService} from '../../../services/store/role.service';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {PermissionService} from '../../../services/store/permission.service';
import {RoleModel} from '../../../data-services/schema/role.model';
import {RoleFullModel} from '../../../data-services/schema/role-full.model';
import {PermissionModel} from '../../../data-services/schema/permission.model';
import {GrantPermissionModel} from '../../../data-services/schema/grant-permission.model';


declare var $: any;

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html'
})
export class UpdateRoleComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateRoleModalWrapper', {static: true}) updateRoleModalWrapper: ModalWrapperComponent;
  @ViewChild('updateRoleForm', {static: true}) updateRoleForm: NgForm;

  public roleFull: RoleFullModel = new RoleFullModel();
  public permissionList: PermissionModel[] = [];
  public selectedPermission: PermissionModel[] = [];
  public grantPermission: GrantPermissionModel;
  public isCheckedPermission: boolean[] = [];

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateRoleModalWrapper.id} .modal-dialog`);
  }

  public show(role: RoleModel, event: Event): void {
    event.preventDefault();
    this.permissionList = [];
    this.selectedPermission = [];
    this.isCheckedPermission = [];
    this.loadData();
    this.getRoleFull(role.id);
    this.updateRoleModalWrapper.show();

  }

  public hide(): void {
    this.updateRoleForm.onReset();
    this.updateRoleModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.roleFull = new RoleFullModel();
    this.updateRoleForm.onReset();
  }

  private getRoleFull(id: number): void{
    this.loading.show();
    this.roleService.getById(id).subscribe(res => this.getRoleFullCompleted(res));
  }

  private getRoleFullCompleted(res: ResponseModel<RoleFullModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.roleFull = res.result;
    for (const item of this.roleFull.grantPermissions){
      this.selectedPermission.push(item.permission);
    }

    for (let i = 0; i < this.permissionList.length; i++){
      const tempPermission = this.selectedPermission.find(item => item.code === this.permissionList[i].code);
      if (tempPermission !== undefined){
        this.isCheckedPermission[i] = true;
      }
      else {
        this.isCheckedPermission[i] = false;
      }
    }
  }

  private loadData(): void {
    this.loading.show();
    this.getPermission();
  }

  private getPermission(): void{
    this.permissionService.findAll().subscribe(res => this.getPermissionCompleted(res));
  }

  private getPermissionCompleted(res: ResponseModel<PermissionModel[]>): void {
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

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

  public isValid(): boolean{
    if (this.updateRoleForm.invalid){
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

    for (const item of this.roleFull.grantPermissions){
      const tempPermission = this.selectedPermission.find(e => item.permission.code === e.code);

      if (tempPermission === undefined){
        this.roleFull.grantPermissions = this.roleFull.grantPermissions.filter(e =>
          e.permission.code !== item.permission.code);
      }
    }

    for (const item of this.selectedPermission){
      const tempPermission = this.roleFull.grantPermissions.find(e => item.code === e.permission.code);
      if (tempPermission !== undefined){
        continue;
      }
      this.grantPermission = new GrantPermissionModel();
      this.grantPermission.permission = item;
      this.roleFull.grantPermissions.push(this.grantPermission);
    }

    this.saveRole();
  }

  private saveRole(): void {
    this.loading.show(this.targetModalLoading);
    this.roleService.update(this.roleFull).subscribe(res => this.saveRoleCompleted(res));
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
