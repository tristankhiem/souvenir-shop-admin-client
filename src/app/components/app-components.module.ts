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
import {UpdateEmployeeComponent} from './popups/update-employee/update-employee.component';
import {AddZoningBaseComponent} from './popups/add-zoning-base/add-zoning-base.component';
import {UpdateZoningBaseComponent} from './popups/update-zoning-base/update-zoning-base.component';
import {AddZoningInformationComponent} from './popups/add-zoning-information/add-zoning-information.component';
import {UpdateZoningInformationComponent} from './popups/update-zoning-information/update-zoning-information.component';
import {AddCustomerGroupComponent} from './popups/add-customer-group/add-customer-group.component';
import {UpdateCustomerGroupComponent} from './popups/update-customer-group/update-customer-group.component';
import {AppCommonNotificationComponent} from './notification/common/app-common-notification.component';
import {AddRoleComponent} from './popups/add-role/add-role.component';
import {UpdateRoleComponent} from './popups/update-role/update-role.component';
import {InfoCustomerComponent} from './popups/info-customer/info-customer.component';
import {AddViolateDocumentComponent} from './popups/add-violate-document/add-violate-document.component';
import {AddViolateOtherDocumentComponent} from './popups/add-violate-other-document/add-violate-other-document.component';
import {AddFeedbackViolateComponent} from './popups/add-feedback-violate/add-feedback-violate.component';
import {ViewFeedbackViolateComponent} from './popups/view-feedback-violate/view-feedback-violate.component';
import {AddColorComponent} from './popups/add-color/add-color.component';
import {UpdateColorComponent} from './popups/update-color/update-color.component';
import {AddSizeComponent} from './popups/add-size/add-size.component';
import {UpdateSizeComponent} from './popups/update-size/update-size.component';
import {AddCategoryComponent} from './popups/add-category/add-category.component';
import {UpdateCategoryComponent} from './popups/update-category/update-category.component';
import {AutoCompleteModule} from 'primeng';
import {AddSubCategoryComponent} from './popups/add-sub-category/add-sub-category.component';

const COMPONENTS = [
  AppUserProfileComponent,
  AppCommonNotificationComponent,
  DataTableComponent,
  DropdownMenuComponent,
  ModalWrapperComponent,
  AddEmployeeComponent,
  UpdateEmployeeComponent,
  DatePickerComponent,
  AddZoningBaseComponent,
  UpdateZoningBaseComponent,
  AddZoningInformationComponent,
  UpdateZoningInformationComponent,
  AddCustomerGroupComponent,
  UpdateCustomerGroupComponent,
  AddRoleComponent,
  UpdateRoleComponent,
  InfoCustomerComponent,
  AddViolateDocumentComponent,
  AddViolateOtherDocumentComponent,
  AddFeedbackViolateComponent,
  ViewFeedbackViolateComponent,
  AddColorComponent,
  UpdateColorComponent,
  AddSizeComponent,
  UpdateSizeComponent,
  AddCategoryComponent,
  UpdateCategoryComponent,
  AddSubCategoryComponent
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
