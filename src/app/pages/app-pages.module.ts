import {AppPagesRoutingModule, routedComponents} from './app-pages-routing.module';
import {CommonModule} from '@angular/common';
import {AppComponentsModule} from '../components/app-components.module';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CustomerMgmtComponent } from './customer/customer-mgmt/customer-mgmt.component';

@NgModule({
  declarations: [
    ...routedComponents,
    CustomerMgmtComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppPagesRoutingModule,
    AppComponentsModule
  ],
  providers: [
    ...AppComponentsModule.forRoot().providers
  ]
})
export class AppPagesModule {
}
