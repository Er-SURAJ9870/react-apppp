import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandelService } from '../../../services/error-handel.service'
import { EmployeeService } from '../../../services/employee.service'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css']
})
export class DailyReportComponent implements OnInit {
  employees: any[] = [];
  form: FormGroup;

  dynamicValue = 25;
  isProgress = false;

  constructor(
    private spinner: NgxSpinnerService,
    private errorHandelService: ErrorHandelService,
    private employeeService: EmployeeService,
    private toastrService : ToastrService,
    private fb: FormBuilder,
    private excelService: ExcelService
  ) {
    this.form = this.fb.group({
      fromDate: [""],
    });
  }

  ngOnInit(): any {
    this.fetchEmployees(this.form.value?.fromDate)
  }

  fetchEmployees(fromDate?:any): any {
    this.spinner.show();
    this.employeeService.getEmployeesDailyReport(fromDate).subscribe({
      next: (res: any) => {
        this.employees = res.responseData;
        console.log(JSON.stringify(this.employees))
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  onFromDateChange() {
    if(!this.form.value?.fromDate) {
      this.toastrService.error('Message Error!', "First select From date.");
    }
    this.fetchEmployees(this.form.value?.fromDate)
  }

  

  async generateExcel() {
    console.log("Called excel sheet...........")
    this.isProgress = true;
    this.excelService.dailyExcelExport(this.employees);
    this.isProgress = false;
  }
}