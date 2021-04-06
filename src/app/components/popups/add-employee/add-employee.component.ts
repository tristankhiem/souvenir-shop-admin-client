import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {AppAlert, AppLoading} from '../../../utils';
import {EmployeeService} from '../../../services/district/employee.service';
import {EmployeeGroupService} from '../../../services/district/employee-group.service';
import {WardService} from '../../../services/district/ward.service';
import {RoleService} from '../../../services/district/role.service';
import {ResponseModel} from '../../../data-services/response.model';
import {EmployeeGroupModel} from '../../../data-services/employee-group.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {WardModel} from '../../../data-services/ward.model';
import {RoleModel} from '../../../data-services/role.model';
import {EMPLOYEE_GROUP_CONSTANT} from '../../../constants/employee-group.constant';
import {NgForm} from '@angular/forms';
import {AppCommon} from '../../../utils/app-common';
import {INPUT_PATTERN_CONSTANT} from '../../../constants/input-pattern.constant';
import {WardPermissionModel} from '../../../data-services/ward-permission.model';
import {EmployeeModel} from '../../../data-services/employee-model';

declare var $: any;

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html'
})
export class AddEmployeeComponent implements AfterViewInit {
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

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addEmployeeModalWrapper', {static: true}) addEmployeeModalWrapper: ModalWrapperComponent;
  @ViewChild('addEmployeeForm', {static: true}) addEmployeeForm: NgForm;

  public employeeGroups: EmployeeGroupModel[] = [];
  public wards: WardModel[] = [];
  public roles: RoleModel[] = [];
  public newEmployee: EmployeeModel = new EmployeeModel();
  public isWardGroup = false;

  public phonePattern = INPUT_PATTERN_CONSTANT.phonePattern;
  public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;
  public passwordPattern = INPUT_PATTERN_CONSTANT.passwordPattern;
  public emailPattern = INPUT_PATTERN_CONSTANT.emailPattern;

  private isLoaded = false;
  private countRequest: number;
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addEmployeeModalWrapper.id} .modal-dialog`);
  }

  private onInit(): void {
    this.newEmployee.employeeGroup.id = 0;
    this.newEmployee.role.id = 0;
    this.newEmployee.birthDate = new Date().getTime();
  }

  public show(): void {
    this.onInit();
    this.addEmployeeModalWrapper.show();
    if (!this.isLoaded) {
      this.loadData();
    }
  }

  public hide(): void {
    this.addEmployeeModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.newEmployee = new EmployeeModel();
    this.addEmployeeForm.onReset();
    this.isWardGroup = false;
  }

  public isInvalidWardPermission(): boolean {
    if (!this.addEmployeeForm.touched || this.addEmployeeForm.invalid) {
      return false;
    }

    return this.newEmployee.wardPermissions.length < 1;
  }

  public isValid(): boolean {
    if (this.addEmployeeForm.invalid) {
      return false;
    }

    if (+this.newEmployee.role.id === 0 || +this.newEmployee.employeeGroup.id === 0) {
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

    this.newEmployee.employeeGroup = new EmployeeGroupModel(this.employeeGroups[groupIdx]);
    this.newEmployee.role.id = 0;

    if (this.common.toSlug(this.newEmployee.employeeGroup.name) === EMPLOYEE_GROUP_CONSTANT.WARD_GROUP) {
      this.newEmployee.wardPermissions = [];
      this.isWardGroup = true;
      return;
    }

    this.isWardGroup = false;
  }

  public isWardPermissionChecked(ward: WardModel): boolean {
    const indexWardP = this.newEmployee.wardPermissions.findIndex((wardP: WardPermissionModel) => wardP.ward.id === ward.id);
    if (indexWardP === -1) {
      return false;
    }

    return true;
  }

  public onCheckWardPermission(ward: WardModel): void {
    const indexWardP = this.newEmployee.wardPermissions.findIndex((wardP: WardPermissionModel) => wardP.ward.id === ward.id);
    if (indexWardP === -1) {
      const tempWardP = new WardPermissionModel();
      tempWardP.ward = new WardModel(ward);

      // case ward group
      if (this.common.toSlug(this.newEmployee.employeeGroup.name) === EMPLOYEE_GROUP_CONSTANT.WARD_GROUP) {
        this.newEmployee.wardPermissions = [];
      }

      this.newEmployee.wardPermissions.push(tempWardP);
      return;
    }

    this.newEmployee.wardPermissions.splice(indexWardP, 1);
  }

  public onCheckAllWardPermission(): void {
    if (this.newEmployee.wardPermissions.length === this.wards.length) {
      this.newEmployee.wardPermissions = [];
      return;
    }

    this.newEmployee.wardPermissions = this.wards.map((wardP: WardModel) => {
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

    this.newEmployee.fullNameSlug = this.common.toSlug(this.newEmployee.fullName);
    this.employeeService.save(this.newEmployee).subscribe(res => this.saveEmployeeCompleted(res));
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
