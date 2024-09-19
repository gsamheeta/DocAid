import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {RoutePath} from './app.routing';
import {AngularFileUploaderModule} from 'angular-file-uploader';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {DataComponent, AppointmentDialogComponent} from './data/data.component';
import {LoginComponent, NotificationComponent} from './login/login.component';
import {ProfileComponent, UserInfoDialogComponent} from './profile/profile.component';
import {AdminComponent} from './admin/admin.component';
import {UploadService} from './services/upload.service';
import {DetailsUploadComponent} from './details-upload/details-upload.component';
import {ListUploadComponent} from './list-upload/list-upload.component';
import {FormUploadComponent} from './form-upload/form-upload.component';
import { HomepageComponent } from './homepage/homepage.component';


import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

@NgModule({
  exports: [
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ]
})
export class DemoMaterialModule {
}

@NgModule({
  entryComponents: [NotificationComponent, AppointmentDialogComponent, UserInfoDialogComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    DataComponent,
    LoginComponent,
    ProfileComponent,
    NotificationComponent,
    AdminComponent,
    DetailsUploadComponent,
    ListUploadComponent,
    FormUploadComponent,
    AppointmentDialogComponent,
    UserInfoDialogComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    RoutePath,
    AngularFileUploaderModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'data',
        component: DataComponent
      }])
  ],
  providers: [UploadService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
