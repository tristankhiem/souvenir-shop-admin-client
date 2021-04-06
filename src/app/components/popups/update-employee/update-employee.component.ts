import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {EmployeeService} from '../../../services/district/employee.service';
import {EmployeeGroupService} from '../../../services/district/employee-group.service';
import {WardService} from '../../../services/district/ward.service';
import {RoleService} from '../../../services/district/role.service';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {EmployeeGroupModel} from '../../../data-services/employee-group.model';
import {WardModel} from '../../../data-services/ward.model';
import {RoleModel} from '../../../data-services/role.model';
import {EMPLOYEE_GROUP_CONSTANT} from '../../../constants/employee-group.constant';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {INPUT_PATTERN_CONSTANT} from '../../../constants/input-pattern.constant';
import {EmployeeModel} from '../../../data-services/employee-model';
import {WardPermissionModel} from '../../../data-services/ward-permission.model';

declare var $: any;

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html'
})
export class UpdateEmployeeComponent implements AfterViewInit{
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private employeeService: EmployeeService,
    private employeeGroupService: EmployeeGroupService,
    private wardService: WardService,
    private roleService: RoleService
  ) {
  }

  @Input() updateEmployee: EmployeeModel;
  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateEmployeeModalWrapper', {static: true}) updateEmployeeModalWrapper: ModalWrapperComponent;
  @ViewChild('updateEmployeeForm', {static: true}) updateEmployeeForm: NgForm;

  public employeeGroups: EmployeeGroupModel[] = [];
  public wards: WardModel[] = [];
  public roles: RoleModel[] = [];
  public updatingEmployee: EmployeeModel = new EmployeeModel();
  public isWardGroup = false;

  public phonePattern = INPUT_PATTERN_CONSTANT.phonePattern;
  public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;

  private isLoaded = false;
  private countRequest: number;
  private targetModalLoading = ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateEmployeeModalWrapper.id} .modal-dialog`);
  }

  public show(updateEmployee: EmployeeModel, event: Event): void {
    event.preventDefault();
    this.updatingEmployee = new EmployeeModel(updateEmployee);

    if (this.common.toSlug(this.updatingEmployee.employeeGroup.name) === EMPLOYEE_GROUP_CONSTANT.WARD_GROUP) {
      this.isWardGroup = true;
    }

    this.updateEmployeeModalWrapper.show();
    if (!this.isLoaded) {
      this.loadData();
    }
  }

  public hide(): void {
    this.updateEmployeeModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.updatingEmployee = new EmployeeModel();
    this.updateEmployeeForm.onReset();
    this.isWardGroup = false;
  }

  public isInvalidWardPermission(): boolean {
    if (!this.updateEmployeeForm.touched || this.updateEmployeeForm.invalid) {
      return false;
    }

    return this.updatingEmployee.wardPermissions.length < 1;
  }

  public isValid(): boolean {
    if (this.updateEmployeeForm.invalid) {
      return false;
    }

    if (+this.updatingEmployee.role.id === 0 || +this.updatingEmployee.employeeGroup.id === 0) {
      return false;
    }

    if (this.isInvalidWardPermission()) {
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()) {
      return;
    }

    this.saveEmployee();
  }

  public onChangeGroup(groupId: number): void {
    if (groupId == null) {
      return;
    }

    const groupIdx = this.employeeGroups.findIndex((group) => {
      return group.id === +groupId;
    });

    this.updatingEmployee.employeeGroup = new EmployeeGroupModel(this.employeeGroups[groupIdx]);
    this.updatingEmployee.role.id = 0;

    if (this.common.toSlug(this.updatingEmployee.employeeGroup.name) === EMPLOYEE_GROUP_CONSTANT.WARD_GROUP) {
      this.updatingEmployee.wardPermissions = [];
      this.isWardGroup = true;
      return;
    }

    this.isWardGroup = false;
  }

  public isWardPermissionChecked(ward: WardModel): boolean {
    const indexWardP = this.updatingEmployee.wardPermissions.findIndex((wardP: WardPermissionModel) => wardP.ward.id === ward.id);
    if (indexWardP === -1) {
      return false;
    }

    return true;
  }

  public onCheckWardPermission(ward: WardModel): void {
    const indexWardP = this.updatingEmployee.wardPermissions.findIndex((wardP: WardPermissionModel) => wardP.ward.id === ward.id);
    if (indexWardP === -1) {
      const tempWardP = new WardPermissionModel();
      tempWardP.ward = new WardModel(ward);

      // case ward group
      if (this.common.toSlug(this.updatingEmployee.employeeGroup.name) === EMPLOYEE_GROUP_CONSTANT.WARD_GROUP) {
        this.updatingEmployee.wardPermissions = [];
      }

      this.updatingEmployee.wardPermissions.push(tempWardP);
      return;
    }

    this.updatingEmployee.wardPermissions.splice(indexWardP, 1);
  }

  public onCheckAllWardPermission(): void {
    if (this.updatingEmployee.wardPermissions.length === this.wards.length) {
      this.updatingEmployee.wardPermissions = [];
      return;
    }

    this.updatingEmployee.wardPermissions = this.wards.map((wardP: WardModel) => {
      const tempWardPermission = new WardPermissionModel();
      tempWardPermission.ward = new WardModel(wardP);
      return tempWardPermission;
    });
  }

  private loadData(): void {
    this.loading.show();
    this.countRequest = 3;
    this.getEmployeeGroups();
    this.getWards();
    this.getRoles();
  }

  private loadDataCompleted(): void {
    --this.countRequest;
    if (this.countRequest === 0) {
      this.isLoaded = true;
      this.loading.hide();
    }
  }

  private getEmployeeGroups(): void {
    this.employeeGroupService.findAll().subscribe(res => this.getEmployeeGroupsCompleted(res));
  }

  private getEmployeeGroupsCompleted(res: ResponseModel<EmployeeGroupModel[]>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.employeeGroups = res.result;
  }

  private getWards(): void {
    this.wardService.findAll().subscribe(res => this.getWardsCompleted(res));
  }

  private getWardsCompleted(res: ResponseModel<WardModel[]>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.wards = res.result;
  }

  private getRoles(): void {
    this.roleService.findAll().subscribe(res => this.getRolesCompleted(res));
  }

  private getRolesCompleted(res: ResponseModel<RoleModel[]>): void {
    this.loadDataCompleted();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.roles = res.result;
  }

  private saveEmployee(): void {
    this.loading.show(this.targetModalLoading);

    this.updatingEmployee.fullNameSlug = this.common.toSlug(this.updatingEmployee.fullName);
    this.employeeService.update(this.updatingEmployee).subscribe(res => this.saveEmployeeCompleted(res));
  }

  private saveEmployeeCompleted(res: ResponseModel<EmployeeModel>): void {
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
