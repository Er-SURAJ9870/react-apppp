import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { UserComponent } from './components/user/user/user.component';
import { SettingComponent } from './components/setting/setting.component';
import { PopoverService } from './popover.service';
import { NotificationComponent } from './components/notification/notification/notification.component';
import { CheckInOutReportComponent } from './components/attendance/check-in-out-report/check-in-out-report.component';
import { CheckInOutTableComponent } from './components/attendance/check-in-out-table/check-in-out-table.component';
import { UserAddEditComponent } from './components/user/user-add-edit/user-add-edit.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationAddEditComponent } from './components/notification/notification-add-edit/notification-add-edit.component';
import { AttendanceAddEditComponent } from './components/attendance/attendance-add-edit/attendance-add-edit.component';
import { NgxMaskModule } from 'ngx-mask';
import { LeaveComponent } from './components/leave/leave/leave.component';
import { LeaveAddEditComponent } from './components/leave/leave-add-edit/leave-add-edit.component';
import { NgPipesModule } from 'ngx-pipes';
import { DailyReportComponent } from './components/attendance/daily-report/daily-report.component';
import { WorkHrSettingComponent } from './components/working-hrs/work-hr-setting/work-hr-setting.component';
import { PtoReqComponent } from './components/pto-req/pto-req.component';
import { ExceptionalWorkHrComponent } from './components/working-hrs/exceptional-work-hr/exceptional-work-hr.component';
import { ExceptionalWorkHrAddEditComponent } from './components/exceptional-work-hr-add-edit/exceptional-work-hr-add-edit.component';
import { EditTimesheetReqComponent } from './components/edit-timesheet-req/edit-timesheet-req.component';
import { HolidayComponent } from './components/holiday/holiday/holiday.component';
import { HolidayAddEditComponent } from './components/holiday/holiday-add-edit/holiday-add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    UsersProfileComponent,
    PagesFaqComponent,
    PagesContactComponent,
    PagesLoginComponent,
    UserComponent,
    SettingComponent,
    NotificationComponent,
    CheckInOutReportComponent,
    CheckInOutTableComponent,
    UserAddEditComponent,
    NotificationAddEditComponent,
    AttendanceAddEditComponent,
    LeaveComponent,
    LeaveAddEditComponent,
    DailyReportComponent,
    WorkHrSettingComponent,
    PtoReqComponent,
    ExceptionalWorkHrComponent,
    ExceptionalWorkHrAddEditComponent,
    EditTimesheetReqComponent,
    HolidayComponent,
    HolidayAddEditComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      closeButton: true,
      progressBar: true,
    }),
    AppRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxMaskModule.forRoot(),
    NgPipesModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    PopoverService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
