import {
  MatInputModule,
  MatCardModule,
  MatTableModule,
  MatGridListModule,
  MatSelectModule,
  MatIconModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatButtonModule,
  MatTabsModule
} from '@angular/material';

import { MaterialFileInputModule } from 'ngx-material-file-input';
import localeDA from '@angular/common/locales/da';
import { registerLocaleData } from '@angular/common';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UploadService } from './common/services/upload.service';
import { PriceComponent } from './price/price.component';
import { PriceService } from './common/services/price.service';
import { AnalysePrisService } from './common/services/analyse-pris.service';
import { AnalyseTypeService } from './common/services/analyse-type.service';

registerLocaleData(localeDA);

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'priser',
    component: PriceComponent,
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
    NoAccessComponent,
    HomeComponent,
    PriceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToasterModule.forRoot(),
    MatInputModule,
    BrowserAnimationsModule,
    MatIconModule,
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
    MaterialFileInputModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "da" },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    },
    JwtHelperService,
    ToasterService,
    StorageServiceModule,
    UploadService,
    PriceService,
    AnalysePrisService,
    AnalyseTypeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
