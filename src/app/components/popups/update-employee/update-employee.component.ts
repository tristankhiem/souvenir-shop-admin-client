import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {CategoryService} from '../../../services/store/category.service';
import {EmployeeService} from '../../../services/store/employee.service';
import {RoleService} from '../../../services/store/role.service';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {RoleModel} from '../../../data-services/schema/role.model';
import {EmployeeModel} from '../../../data-services/schema/employee.model';
import {INPUT_PATTERN_CONSTANT} from '../../../constants/input-pattern.constant';
import {ResponseModel} from '../../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';

declare var $: any;

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html'
})

export class UpdateEmployeeComponent implements  AfterViewInit{
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private employeeService: EmployeeService,
    private roleService: RoleService
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateEmployeeModalWrapper', {static: true}) updateEmployeeModalWrapper: ModalWrapperComponent;
  @ViewChild('updateEmployeeForm', {static: true}) updateEmployeeForm: NgForm;

  public roleResult: RoleModel[] = [];
  public role: RoleModel = new RoleModel();
  public employee: EmployeeModel = new EmployeeModel();

  public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;
  public passwordPattern = INPUT_PATTERN_CONSTANT.passwordPattern;
  public emailPattern = INPUT_PATTERN_CONSTANT.emailPattern;

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateEmployeeModalWrapper.id} .modal-dialog`);
  }

  private onInit(): void{
    this.employee.birthDate = new Date().toString();
  }

  public show(employee: EmployeeModel, event: Event): void {
    event.preventDefault();
    this.getEmployee(employee.id);
    this.updateEmployeeModalWrapper.show();

  }

  public hide(): void {
    this.updateEmployeeForm.onReset();
    this.updateEmployeeModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.employee = new EmployeeModel();
    this.updateEmployeeForm.onReset();
  }

  private getEmployee(id: number): void{
    this.loading.show();
    this.employeeService.getById(id).subscribe(res => this.getEmployeeCompleted(res));
  }

  private getEmployeeCompleted(res: ResponseModel<EmployeeModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.employee = res.result;
    this.role = this.employee.role;
  }

  public isValid(): boolean{
    if (this.updateEmployeeForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveEmployee();
  }

  public selectRole(): void {
    this.employee.role = new RoleModel(this.role);
  }

  public searchRoles(event): void {
    this.loading.show(this.targetModalLoading);
    this.roleService.getLikeName(event.query).subscribe(res => this.searchRoleCompleted(res));
  }

  private searchRoleCompleted(res: ResponseModel<RoleModel[]>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.roleResult = res.result;
    this.role = this.employee.role;
  }

  private saveEmployee(): void {
    this.loading.show(this.targetModalLoading);
    this.employeeService.update(this.employee).subscribe(res => this.saveEmployeeCompleted(res));
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

