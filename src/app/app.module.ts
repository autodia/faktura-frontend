import {
  MatInputModule,
  MatCardModule,
  MatTableModule,
  MatGridListModule,
  MatSelectModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatButtonModule,
  MatTabsModule
} from '@angular/material';

import { ToasterModule, ToasterService } from 'angular2-toaster';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppErrorHandler } from './common/error-handling/app-error-handler';

import { BannerComponent } from './common/component/banner/banner.component';
import { NavbarComponent } from './common/component/navbar/navbar.component';
import { NotFoundComponent } from './common/component/not-found/not-found.component';
import { NoAccessComponent } from './common/component/no-access/no-access.component';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'no-access',
    component: NoAccessComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    NavbarComponent,
    NotFoundComponent,
    NoAccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToasterModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatGridListModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatButtonModule,
    MatTabsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    },
    JwtHelperService,
    ToasterService,
    StorageServiceModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
