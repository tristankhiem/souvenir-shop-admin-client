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
import {CustomerGroupModel} from '../../../data-services/customer-group.model';
import {CustomerPermissionModel} from '../../../data-services/customer-permission.model';

declare var $: any;

@Component({
  selector: 'app-update-customer-group',
  templateUrl: './update-customer-group.component.html'
})
export class UpdateCustomerGroupComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private customerGroupService: CustomerGroupService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('updateCustomerGroupModalWrapper', {static: true}) updateCustomerGroupModalWrapper: ModalWrapperComponent;
  @ViewChild('updateCustomerGroupForm', {static: true}) updateCustomerGroupForm: NgForm;

  public customerGroupFull: CustomerGroupFullModel = new CustomerGroupFullModel();
  public permissionList: CustomerPermissionModel[] = [];
  public selectedPermission: CustomerPermissionModel[] = [];
  public customerGrantPermission: CustomerGrantPermissionModel;
  public isCheckedPermission: boolean[] = [];

  private countRequest: number;
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateCustomerGroupModalWrapper.id} .modal-dialog`);
  }

  public show(customerGroup: CustomerGroupModel, event: Event): void {
    event.preventDefault();
    this.selectedPermission = [];
    this.isCheckedPermission = [];
    this.loadData();
    this.getCustomerGroupFull(customerGroup.id);
    this.updateCustomerGroupModalWrapper.show();

  }

  public hide(): void {
    this.updateCustomerGroupForm.onReset();
    this.updateCustomerGroupModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.customerGroupFull = new CustomerGroupFullModel();
    this.updateCustomerGroupForm.onReset();
  }

  private loadData(): void {
    this.loading.show();
    this.countRequest = 1;
    this.getPermission();
  }

  private loadDataCompleted(): void {
    --this.countRequest;
    if (this.countRequest === 0) {
      this.loading.hide();
    }
  }

  private getCustomerGroupFull(id: number): void{
    this.loading.show();
    this.customerGroupService.getCustomerGroupFull(id).subscribe(res => this.getCustomerGroupFullCompleted(res));
  }

  private getCustomerGroupFullCompleted(res: ResponseModel<CustomerGroupFullModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.customerGroupFull = res.result;
    for (const permission of this.customerGroupFull.customerGrantPermissions){
      this.selectedPermission.push(permission.customerPermission);
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

  private getPermission(): void{
    this.customerGroupService.findAllCustomerPermission().subscribe(res => this.getPermissionCompleted(res));
  }

  private getPermissionCompleted(res: ResponseModel<CustomerPermissionModel[]>): void {
    this.loadDataCompleted();
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

  public isValid(): boolean{
    if (this.updateCustomerGroupForm.invalid){
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

    for (const item of this.customerGroupFull.customerGrantPermissions){
      const tempPermission = this.selectedPermission.find(e => item.customerPermission.code === e.code);

      if (tempPermission === undefined){
        this.customerGroupFull.customerGrantPermissions = this.customerGroupFull.customerGrantPermissions.filter(e =>
          e.customerPermission.code !== item.customerPermission.code);
      }
    }

    for (const item of this.selectedPermission){
      const tempPermission = this.customerGroupFull.customerGrantPermissions.find(e => item.code === e.customerPermission.code);
      if (tempPermission !== undefined){
        continue;
      }
      this.customerGrantPermission = new CustomerGrantPermissionModel();
      this.customerGrantPermission.customerPermission = item;
      this.customerGroupFull.customerGrantPermissions.push(this.customerGrantPermission);
    }
    this.saveCustomerGroup();
  }

  private saveCustomerGroup(): void {
    this.loading.show(this.targetModalLoading);
    this.customerGroupService.update(this.customerGroupFull).subscribe(res => this.saveCustomerGroupCompleted(res));
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
