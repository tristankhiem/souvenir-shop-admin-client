import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './pages/error/404/not-found.component';
import {AccessDeniedComponent} from './pages/error/403/access-denied.component';
import {LoginComponent} from './pages/login/login.component';
import {LayoutComponent} from './partials/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/app-pages.module').then((m) => m.AppPagesModule),
      },
    ],
  },
  {
    path: 'dang-nhap',
    component: LoginComponent,
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '403',
    component: AccessDeniedComponent,
  },
  {path: '**', redirectTo: '404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [
  LayoutComponent,
  LoginComponent,
  NotFoundComponent,
  AccessDeniedComponent
  
];
