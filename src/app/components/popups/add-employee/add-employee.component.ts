import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {AppAlert, AppLoading} from '../../../utils';
import {EmployeeService} from '../../../services/store/employee.service';
import {EmployeeGroupService} from '../../../services/district/employee-group.service';
import {WardService} from '../../../services/district/ward.service';
import {RoleService} from '../../../services/store/role.service';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {RoleModel} from '../../../data-services/role.model';
import {NgForm} from '@angular/forms';
import {AppCommon} from '../../../utils/app-common';
import {INPUT_PATTERN_CONSTANT} from '../../../constants/input-pattern.constant';
import {EmployeeModel} from '../../../data-services/schema/employee.model';

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

  public roleResult: RoleModel[] = [];
  public role: RoleModel = new RoleModel();
  public newEmployee: EmployeeModel = new EmployeeModel();

  // public phonePattern = INPUT_PATTERN_CONSTANT.phonePattern;
  public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;
  public passwordPattern = INPUT_PATTERN_CONSTANT.passwordPattern;
  public emailPattern = INPUT_PATTERN_CONSTANT.emailPattern;

  // private isLoaded = false;
  // private countRequest: number;
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addEmployeeModalWrapper.id} .modal-dialog`);
  }

  // private onInit(): void {
  //   this.newEmployee.employeeGroup.id = 0;
  //   this.newEmployee.role.id = 0;
  //   this.newEmployee.birthDate = new Date().getTime();
  // }

  public show(): void {
    // this.onInit();
    this.addEmployeeModalWrapper.show();
    // if (!this.isLoaded) {
    //   this.loadData();
    // }
  }

  public hide(): void {
    this.addEmployeeModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.newEmployee = new EmployeeModel();
    this.addEmployeeForm.onReset();
    // this.isWardGroup = false;
  }

  // public isInvalidWardPermission(): boolean {
  //   if (!this.addEmployeeForm.touched || this.addEmployeeForm.invalid) {
  //     return false;
  //   }
  //
  //   return this.newEmployee.wardPermissions.length < 1;
  // }

  public isValid(): boolean {
    if (this.addEmployeeForm.invalid){
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

  // private loadData(): void {
  //   this.loading.show();
  //   this.countRequest = 3;
  //   // this.getEmployeeGroups();
  //   // this.getWards();
  //   this.getRoles();
  // }
  //
  // private loadDataCompleted(): void {
  //   --this.countRequest;
  //   if (this.countRequest === 0) {
  //     this.isLoaded = true;
  //     this.loading.hide();
  //   }
  // }

  public selectRole(): void {
    this.newEmployee.role = new RoleModel(this.role);
  }

  public searchRoles(event): void {
    this.loading.show(this.targetModalLoading);
    this.roleService.getLikeName(event.query).subscribe(res => this.searchCategoryCompleted(res));
  }

  private searchCategoryCompleted(res: ResponseModel<RoleModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.roleResult = res.result || [];
  }

  // private getRoles(): void {
  //   this.roleService.findAll().subscribe(res => this.getRolesCompleted(res));
  // }
  //
  // private getRolesCompleted(res: ResponseModel<RoleModel[]>): void {
  //   this.loadDataCompleted();
  //   if (res.status !== HTTP_CODE_CONSTANT.OK) {
  //     this.alert.errorMessages(res.message);
  //     return;
  //   }
  //
  //   this.roleResult = res.result;
  // }

  private saveEmployee(): void {
    this.loading.show(this.targetModalLoading);

    // this.newEmployee.fullNameSlug = this.common.toSlug(this.newEmployee.fullName);
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
