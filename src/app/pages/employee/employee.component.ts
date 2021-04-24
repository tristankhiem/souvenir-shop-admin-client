import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {EmployeeModel} from '../../data-services/schema/employee.model';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {EmployeeService} from '../../services/store/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private employeeService: EmployeeService,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals
  ){}

  @ViewChild('dataTableEmployee', {read: ElementRef}) dataTableEmployee: ElementRef;

  public search: BaseSearchModel<EmployeeModel[]> = new BaseSearchModel<EmployeeModel[]>();

  ngOnInit(): void {
    this.getEmployees();
  }

  public onChangeDataEvent(search?: BaseSearchModel<EmployeeModel[]>): void {
    if (search) {
      this.search = search;
    }

    this.getEmployees(this.dataTableEmployee.nativeElement);
  }

  public openDeleteModal(employee: EmployeeModel, event: Event): void {
    event.preventDefault();
    this.modal.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${employee.name}?`, 'Xóa tài khoản cán bộ', true)
      .subscribe(res => this.confirmDeleteEmployee(res, employee));
  }

  private getEmployees(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.employeeService.search(this.search).subscribe( res =>  this.getEmployeesCompleted(res, targetLoading));
  }

  private getEmployeesCompleted(res: ResponseModel<BaseSearchModel<EmployeeModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
  }

  private confirmDeleteEmployee(state: boolean, employee: EmployeeModel): void {
    if (!state) {
      return;
    }

    this.loading.show();
    this.employeeService.deleteEmployee(employee.id).subscribe(res => this.deleteEmployeeCompleted(res));
  }

  private deleteEmployeeCompleted(res: ResponseModel<any>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.onChangeDataEvent();
  }

}
