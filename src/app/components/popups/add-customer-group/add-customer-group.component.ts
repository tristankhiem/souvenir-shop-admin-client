import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {CustomerGroupService} from '../../../services/customer/customer-group.service';
import {CustomerGroupFullModel} from '../../../data-services/customer-group-full.model';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {CustomerGrantPermissionModel} from '../../../data-services/customer-grant-permission.model';
import {CustomerPermissionModel} from '../../../data-services/customer-permission.model';

declare var $: any;

@Component({
  selector: 'app-add-customer-group',
  templateUrl: './add-customer-group.component.html'
})
export class AddCustomerGroupComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private customerGroupService: CustomerGroupService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addCustomerGroupModalWrapper', {static: true}) addCustomerGroupModalWrapper: ModalWrapperComponent;
  @ViewChild('addCustomerGroupForm', {static: true}) addCustomerGroupForm: NgForm;

  public customerGroupFull: CustomerGroupFullModel = new CustomerGroupFullModel();
  public permissionList: CustomerPermissionModel[] = [];
  public selectedPermission: CustomerPermissionModel[] = [];
  public customerGrantPermission: CustomerGrantPermissionModel;

  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addCustomerGroupModalWrapper.id} .modal-dialog`);
  }

  public show(): void {
    this.getPermission();
    this.selectedPermission = [];
    this.addCustomerGroupModalWrapper.show();

  }

  public hide(): void {
    this.addCustomerGroupForm.onReset();
    this.addCustomerGroupModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.customerGroupFull = new CustomerGroupFullModel();
    this.addCustomerGroupForm.onReset();
  }

  private getPermission(): void{
    this.loading.show();
    this.customerGroupService.findAllCustomerPermission().subscribe(res => this.getPermissionCompleted(res));
  }

  private getPermissionCompleted(res: ResponseModel<CustomerPermissionModel[]>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.permissionList = res.result;
  }

  public onCheck(permission: CustomerPermissionModel): void{
    for (const item of this.selectedPermission){
      if (permission.code === item.code){
        this.selectedPermission = this.selectedPermission.filter(e => e.code !== item.code);
        return;
      }
    }
    this.selectedPermission.push(permission);
  }

  public isValid(): boolean {
    if (this.addCustomerGroupForm.invalid){
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
    this.customerGroupFull.customerGrantPermissions = [];
    for (const item of this.selectedPermission){
      this.customerGrantPermission = new CustomerGrantPermissionModel();
      this.customerGrantPermission.customerPermission = item;
      this.customerGroupFull.customerGrantPermissions.push(this.customerGrantPermission);
    }
    this.saveCustomerGroup();
  }

  private saveCustomerGroup(): void {
    this.loading.show(this.targetModalLoading);
    this.customerGroupService.save(this.customerGroupFull).subscribe(res => this.saveCustomerGroupCompleted(res));
  }

  private saveCustomerGroupCompleted(res: ResponseModel<CustomerGroupFullModel>): void {
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
