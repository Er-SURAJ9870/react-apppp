import { Component, OnInit, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandelService } from '../../services/error-handel.service';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  employees: any[] = [];
  dynamicValue = 25;
  isProgress = false;
  dashboardData: any;
  filter!: string;
  isLoader = false;
  caresoleData: { title: string; description: string }[];
  today: Date;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private errorHandelService: ErrorHandelService,
    private elementRef: ElementRef,
    private employeeService: EmployeeService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private excelService: ExcelService
  ) {
    this.today = new Date();
    this.today.setHours(8, 0, 0, 0)
    this.employees = [];
    this.caresoleData = [];
    this.form = this.fb.group({
      fromDate: [this.today, Validators.required],
    });
  }

  ngOnInit(): void {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '../assets/js/main.js';
    this.elementRef.nativeElement.appendChild(s);
    this.dashboard(this.form.value?.fromDate);
    this.fetchEmployees(this.form.value?.fromDate);
  }

  fetchEmployees(fromDate?: any): any {
    this.spinner.show();
    this.employeeService.getEmployeesDailyReport(fromDate).subscribe({
      next: (res: any) => {
        this.employees = res.responseData;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  dashboard(filter: string): any {
    this.spinner.show();
    this.employeeService.dashboard(filter).subscribe({
      next: (res: any) => {
        this.dashboardData = res.responseData.dashboard;
        this.caresoleData = res.responseData.notification;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  truncateDescription(description: string, maxLength: number): string {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  }

  onFromDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (!this.form.value?.fromDate) {
      this.toastrService.error('Message Error!', 'First select From date.');
      return;
    }
    this.fetchEmployees(this.form.value?.fromDate);
  }

  async generateExcel() {
    console.log('Called excel sheet...........');
    this.isProgress = true;
    const date = this.form.value?.fromDate || new Date()
    this.excelService.dailyExcelExport(this.employees, date);
    this.isProgress = false;
  }
}
