import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
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
    path: 'employee',
    component: EmployeeComponent,
  },
  {
    path: 'thay-doi-mat-khau',
    component: ChangePasswordComponent
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
  ChangePasswordComponent,
  ColorComponent,
  SizeComponent,
  CategoryComponent,
  SubCategoryComponent,
  RoleComponent,
  EmployeeComponent,
  SupplierComponent
];
