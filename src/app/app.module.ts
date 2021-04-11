import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponentsModule} from './components/app-components.module';
import {AppRoutingModule, routedComponents} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from './partials/sidebar/sidebar.component';
import {NavbarComponent} from './partials/navbar/navbar.component';
import {FooterComponent} from './partials/footer/footer.component';

import * as Services from './services';
import * as Utils from './utils';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

const PARTIALS = [
  SidebarComponent,
  NavbarComponent,
  FooterComponent
];

const UTILS_PROVIDERS = [
  Utils.AppModals,
  Utils.AppLoading,
  Utils.AppAlert,
  Utils.AppGuid
];

@NgModule({
  declarations: [
    ...routedComponents,
    AppComponent,
    ...PARTIALS
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    NoopAnimationsModule,
    AppRoutingModule,
    AppComponentsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Services.CustomHandleInterceptor,
      multi: true
    },
    ...UTILS_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
