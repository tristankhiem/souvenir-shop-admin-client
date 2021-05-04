import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AppUserProfileComponent} from './user-profile/app-user-profile.component';
import {DropdownMenuComponent} from './commons/dropdown-menu/dropdown-menu.component';
import {DataTableComponent} from './commons/data-table/data-table.component';
import {ModalWrapperComponent} from './commons/modal-wrapper/modal-wrapper.component';
import {AddEmployeeComponent} from './popups/add-employee/add-employee.component';
import {DatePickerComponent} from './commons/date-picker/date-picker.component';
import {AddRoleComponent} from './popups/add-role/add-role.component';
import {UpdateRoleComponent} from './popups/update-role/update-role.component';
import {AddColorComponent} from './popups/add-color/add-color.component';
import {UpdateColorComponent} from './popups/update-color/update-color.component';
import {AddSizeComponent} from './popups/add-size/add-size.component';
import {UpdateSizeComponent} from './popups/update-size/update-size.component';
import {AddCategoryComponent} from './popups/add-category/add-category.component';
import {UpdateCategoryComponent} from './popups/update-category/update-category.component';
import {AutoCompleteModule} from 'primeng';
import {AddSubCategoryComponent} from './popups/add-sub-category/add-sub-category.component';
import {UpdateSubCategoryComponent} from './popups/update-sub-category/update-sub-category.component';
import {AddSupplierComponent} from './popups/add-supplier/add-supplier.component';
import {UpdateSupplierComponent} from './popups/update-supplier/update-supplier.component';
import {AddImportingOrderComponent} from './popups/add-importing-order/add-importing-order.component';
import {AddProductComponent} from './popups/add-product/add-product.component';
import {UpdateProductComponent} from './popups/update-product/update-product.component';
import {UpdateEmployeeComponent} from './popups/update-employee/update-employee.component';
import {UpdateCustomerComponent} from './popups/update-customer/update-customer.component';
import {AddCustomerComponent} from './popups/add-customer/add-customer.component';

const COMPONENTS = [
  AppUserProfileComponent,
  DataTableComponent,
  DropdownMenuComponent,
  ModalWrapperComponent,
  AddEmployeeComponent,
  DatePickerComponent,
  AddRoleComponent,
  UpdateRoleComponent,
  AddColorComponent,
  UpdateColorComponent,
  AddSizeComponent,
  UpdateSizeComponent,
  AddCategoryComponent,
  UpdateCategoryComponent,
  AddSubCategoryComponent,
  UpdateSubCategoryComponent,
  AddSupplierComponent,
  UpdateSupplierComponent,
  AddImportingOrderComponent,
  AddProductComponent,
  UpdateProductComponent
  UpdateEmployeeComponent,
  AddCustomerComponent,
  UpdateCustomerComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    AutoCompleteModule
  ],
  exports: [
    ...COMPONENTS
  ],
  providers: []
})
export class AppComponentsModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AppComponentsModule,
      providers: []
    } as ModuleWithProviders<any>;
  }
}
