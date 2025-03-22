import { Component, OnInit} from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandelService } from '../../../services/error-handel.service'
import { EmployeeService } from '../../../services/employee.service'
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ExcelService } from 'src/app/services/excel.service';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-check-in-out-report',
  templateUrl: './check-in-out-report.component.html',
  styleUrls: ['./check-in-out-report.component.css']
})
export class CheckInOutReportComponent implements OnInit {
  employees: any[];
  users: any[] = [];

  id !: string;
  user: any;
  totalSum: any;
  form: FormGroup;

  payCycles : string[] = [];
  fromCycles : string[] = [];
  toCycles : string[] = [];

  isPayCycle: boolean = true
  payCycleForm!: any;
  userDropDownForm!: any;
  isAddEnable = true;
  name: string = ""
  dynamicValue = 25;
  isProgress = false;
  tempName = ""
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private errorHandelService: ErrorHandelService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private excelService: ExcelService,
    private utilService: UtilService

  ) {
    this.route.queryParams.subscribe(params => {
      this.name = JSON.parse(this.utilService.decrypt(params['name']));
      this.tempName = params['name']
    });
    const { payCycle, startCycle, endCycle} = this.authService.getPayCycle();
    this.payCycles = payCycle;
    this.fromCycles = startCycle;
    this.toCycles = endCycle;
    this.employees = [];
    this.form = this.fb.group({
      fromDate: ["", [this.dateValidator]],
      toDate: [""],
    });
    this.payCycleForm = new FormControl('');
    this.userDropDownForm = new FormControl('');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.userDropDownForm.value = this.id;
    this.getUsersDropdown()
    this.getPayCycle();
    this.payCycleForm.value = this.payCycles[0];
    if(this.authService.getEncryptedData("edit-url-cache")){
      this.payCycleForm.value = this.authService.getEncryptedData("edit-url-cache")
    }
    
    console.log(this.payCycles)
    this.getEmployeeDetail(this.id, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value)
  }

  dateValidator(control: FormControl): { [key: string]: any } | "" {
    const value = control.value;
  
    if (value && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return { 'invalidDate': true };
    }
  
    return "";
  }

  navigateToEdit(itemId: string, userId: string) {
    this.authService.setEncryptedData(this.payCycleForm.value, "edit-url-cache")
    const queryParams: NavigationExtras = {
      queryParams: {
        id: userId,
        name: this.tempName
      }
    };
    this.router.navigate(['/employee-attendance/edit/', itemId], queryParams);
  }


  getEmployeeDetail(id: string, fromDate?:any, toDate?: any, payCycleValue?: any): any {
    this.spinner.show();
    this.employeeService.getEmployee(id, fromDate, toDate, payCycleValue).subscribe({
      next: (res: any) => {
        if(res && res.responseData && res.responseData.data && res.responseData.data.length){
          if(res.responseData.data.length){
            this.isAddEnable = false;
          }
          this.employees = res.responseData.data;
          this.totalSum = res.responseData.totalSum;
          this.user = res.responseData.user;
        }else{
          this.employees = []
          this.totalSum = null
          this.toastrService.error('Message Error!', res.responseData);
        }
        this.spinner.hide();
      },
      error: (err: any) => {
        this.employees = []
        this.totalSum = null
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }



  onFromDateChange() {
    this.form.patchValue({toDate: ""})
    this.payCycleForm.reset()
  }

  onToDateChange() {
    if(!this.form.value?.fromDate) {
      this.toastrService.error('Message Error!', "First select From date.");
    }
    if(new Date(this.form.value?.fromDate) > new Date(this.form.value?.toDate)){
      this.toastrService.error('Message Error!', "From-date must be less than or equal to To-date");
    }
    this.isPayCycle = false;
    this.payCycleForm.reset()
    this.getEmployeeDetail(this.id, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value)
  }
  
  resetFilters() {
    this.isPayCycle = true;
    this.payCycleForm.reset()
    this.form.patchValue({toDate: "", fromDate: ""})
    this.getEmployeeDetail(this.id, this.form.value?.fromDate, this.form.value?.toDate, "")
  }

  getPayCycle(): any {
    this.employeeService.getPayCycle().subscribe({
      next: (res: any) => {
        this.payCycles = res.responseData.payCycle;
        this.authService.setPayCycle(res.responseData)
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  applyFilter() {
    this.form.patchValue({toDate: "", fromDate: ""})
    this.getEmployeeDetail(this.id, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value)
  }

  getUsersDropdown(): any {
    this.spinner.show();
    this.userService.getUsersDropdown().subscribe({
      next: (res: any) => {
        this.users = res.responseData;
        if(this.users.find( d=> d._id.toString() !== this.id.toString())){
          this.users.push({_id: this.id , name: this.name})
        }
        this.users =[...new Map(this.users.map(item => [item['_id'], item])).values()]
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  onUserSelect(event: any): void {
    this.id = event.target.value;
    this.getEmployeeDetail(this.id, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value)
  }

  async generateExcel() {
    console.log("Called excel sheet...........")
    this.isProgress = true;
    const res = await this.employeeService.getExcelExportEmployeesById(this.id, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value);
    if(res && res.responseData.data){
      let paycycle = ""
      if(!this.payCycleForm.value){
        paycycle = `${this.form.value?.fromDate}-${this.form.value?.toDate}`
      }else{
        paycycle = this.payCycleForm.value
      }

      this.excelService.timeSheetExcelExportByUser(res.responseData, paycycle);
      this.isProgress = false;
    }else{
      this.isProgress = false;
      this.toastrService.error('Message Error!', "Invalid Data.");
    }
  }

}
