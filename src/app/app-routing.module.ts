import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { UsersProfileComponent } from './pages/users-profile/users-profile.component';
import { AuthGuard } from './auth.guard';
import { UserComponent } from './components/user/user/user.component';
import { NotificationComponent } from './components/notification/notification/notification.component';
import { SettingComponent } from './components/setting/setting.component';
import { CheckInOutTableComponent } from './components/attendance/check-in-out-table/check-in-out-table.component';
import { CheckInOutReportComponent } from './components/attendance/check-in-out-report/check-in-out-report.component';
import { UserAddEditComponent } from './components/user/user-add-edit/user-add-edit.component';
import { NotificationAddEditComponent } from './components/notification/notification-add-edit/notification-add-edit.component';
import { AttendanceAddEditComponent } from './components/attendance/attendance-add-edit/attendance-add-edit.component';
import { LeaveComponent } from './components/leave/leave/leave.component';
import { LeaveAddEditComponent } from './components/leave/leave-add-edit/leave-add-edit.component';
import { DailyReportComponent } from './components/attendance/daily-report/daily-report.component';
import { WorkHrSettingComponent } from './components/working-hrs/work-hr-setting/work-hr-setting.component';
import { PtoReqComponent } from './components/pto-req/pto-req.component';
import { ExceptionalWorkHrComponent } from './components/working-hrs/exceptional-work-hr/exceptional-work-hr.component';
import { ExceptionalWorkHrAddEditComponent } from './components/exceptional-work-hr-add-edit/exceptional-work-hr-add-edit.component';
import { EditTimesheetReqComponent } from './components/edit-timesheet-req/edit-timesheet-req.component';
import { HolidayComponent } from './components/holiday/holiday/holiday.component';
import { HolidayAddEditComponent } from './components/holiday/holiday-add-edit/holiday-add-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'pages-contact', component: PagesContactComponent, canActivate: [AuthGuard] },
  { path: 'pages-faq', component: PagesFaqComponent, canActivate: [AuthGuard] },
  { path: 'pages-login', component: PagesLoginComponent },
  { path: 'user-profile', component: UsersProfileComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'ex-employee', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'user/add', component: UserAddEditComponent, canActivate: [AuthGuard] },
  { path: 'user/edit/:id', component: UserAddEditComponent, canActivate: [AuthGuard] },
  { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'notification/add', component: NotificationAddEditComponent, canActivate: [AuthGuard] },
  { path: 'notification/edit/:id', component: NotificationAddEditComponent, canActivate: [AuthGuard] },
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
  { path: 'employee-attendance', component: CheckInOutTableComponent, canActivate: [AuthGuard] },
  { path: 'employee-attendance/detail/:id', component: CheckInOutReportComponent, canActivate: [AuthGuard] },
  { path: 'employee-attendance/add', component: AttendanceAddEditComponent, canActivate: [AuthGuard] },
  { path: 'employee-attendance/edit/:id', component: AttendanceAddEditComponent, canActivate: [AuthGuard] },
  { path: 'leave', component: LeaveComponent, canActivate: [AuthGuard] },
  { path: 'leave/add', component: LeaveAddEditComponent, canActivate: [AuthGuard] },
  { path: 'leave/edit/:id', component: LeaveAddEditComponent, canActivate: [AuthGuard] },
  { path: 'daily-report', component: DailyReportComponent, canActivate: [AuthGuard] },
  { path: 'working-hrs', component: WorkHrSettingComponent, canActivate: [AuthGuard] },
  { path: 'pto-req', component: PtoReqComponent, canActivate: [AuthGuard] },
  { path: 'working-hrs/exceptional-work-hrs/:userId', component: ExceptionalWorkHrComponent, canActivate: [AuthGuard] },
  { path: 'working-hrs/exceptional/work-hrs/add', component: ExceptionalWorkHrAddEditComponent, canActivate: [AuthGuard] },
  { path: 'working-hrs/exceptional/work-hrs/edit', component: ExceptionalWorkHrAddEditComponent, canActivate: [AuthGuard] },
  { path: 'timesheet-edit-req', component: EditTimesheetReqComponent, canActivate: [AuthGuard] },

  { path: 'holiday', component: HolidayComponent, canActivate: [AuthGuard] },
  { path: 'holiday/add', component: HolidayAddEditComponent, canActivate: [AuthGuard] },
  { path: 'holiday/edit/:id', component: HolidayAddEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
