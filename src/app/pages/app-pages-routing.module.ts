import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RoleMgmtComponent} from './employee-district/role-mgmt/role-mgmt.component';
import {EmployeeMgmtComponent} from './employee-district/employee-mgmt/employee-mgmt.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ZoningBaseComponent} from './employee-district/zone-mgmt/zoning-base/zoning-base.component';
import {ZoningTypeComponent} from './employee-district/zone-mgmt/zoning-type/zoning-type.component';
import {ZoningTypeResolverService} from '../services/district/resolvers/zoning-type-resolver.service';
import {ZoningInformationComponent} from './employee-district/zone-mgmt/zoning-information/zoning-information.component';
import {CustomerGroupMgmtComponent} from './customer/customer-group-mgmt/customer-group-mgmt.component';
import {ConstructionViolateMgmtComponent} from './employee-district/construction-violate-mgmt/construction-violate-mgmt.component';
import {ConstructionViolateAddComponent} from './employee-district/construction-violate-mgmt/construction-violate-add/construction-violate-add.component';
import {ConstructionViolateUpdateComponent} from './employee-district/construction-violate-mgmt/construction-violate-update/construction-violate-update.component';
import {CustomerMgmtComponent} from './customer/customer-mgmt/customer-mgmt.component';
import {ZoningSearchComponent} from './employee-district/zone-mgmt/zoning-search/zoning-search.component';
import {ColorComponent} from './color/color.component';
import {SizeComponent} from './size/size.component';
import {CategoryComponent} from './category/category.component';
import {SubCategoryComponent} from './sub-category/sub-category.component';
import {RoleComponent} from './role/role.component';
import {EmployeeComponent} from './employee/employee.component';
import {SupplierComponent} from './supplier/supplier.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trang-chu',
    pathMatch: 'full',
  },
  {
    path: 'trang-chu',
    component: HomeComponent,
  },
  {
    path: 'quan-ly-chuc-vu',
    component: RoleMgmtComponent,
  },
  {
    path: 'employee',
    component: EmployeeComponent,
  },
  {
    path: 'quan-ly-quy-hoach',
    resolve: {
      zoningTypes: ZoningTypeResolverService
    },
    children: [
      {
        path: ':typeSlug',
        component: ZoningBaseComponent,
      },
      {
        path: '',
        component: ZoningTypeComponent
      }
    ]
  },
  {
    path: 'quan-ly-thong-tin-dat',
    component: ZoningInformationComponent
  },
  {
    path: 'tra-cuu-thong-tin',
    component: ZoningSearchComponent
  },
  {
    path: 'thay-doi-mat-khau',
    component: ChangePasswordComponent
  },
  {
    path: 'quan-ly-nhom-khach-hang',
    component: CustomerGroupMgmtComponent,
  },
  {
    path: 'quan-ly-khach-hang',
    component: CustomerMgmtComponent,
  },
  {
    path: 'quan-ly-vi-pham-xay-dung',
    component: ConstructionViolateMgmtComponent,
  },
  {
    path: 'tao-bien-ban-xu-phat-xay-dung',
    component: ConstructionViolateAddComponent,
  },
  {
    path: 'xu-ly-vi-pham-xay-dung/:violateId',
    component: ConstructionViolateUpdateComponent,
  },
  {
    path: 'color',
    component: ColorComponent,
  },
  {
    path: 'size',
    component: SizeComponent,
  },
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: 'sub-category',
    component: SubCategoryComponent,
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  {
    path: 'supplier',
    component: SupplierComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPagesRoutingModule {
}

export const routedComponents = [
  HomeComponent,
  RoleMgmtComponent,
  EmployeeMgmtComponent,
  ZoningTypeComponent,
  ZoningBaseComponent,
  ZoningInformationComponent,
  ZoningSearchComponent,
  ChangePasswordComponent,
  CustomerGroupMgmtComponent,
  CustomerMgmtComponent,
  ConstructionViolateMgmtComponent,
  ConstructionViolateAddComponent,
  ConstructionViolateUpdateComponent,
  ColorComponent,
  SizeComponent,
  CategoryComponent,
  SubCategoryComponent,
  RoleComponent,
  EmployeeComponent,
  SupplierComponent
];
