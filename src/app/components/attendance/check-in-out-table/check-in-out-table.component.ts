import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandelService } from '../../../services/error-handel.service'
import { EmployeeService } from '../../../services/employee.service'
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/services/excel.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { LeaveService } from 'src/app/services/leave.service';
declare var window: any;

// Define the custom validator function
export function remainingPtoValidator(leaveRemainingInDecimalControl: AbstractControl): ValidatorFn {
  return (ptoControl: AbstractControl): { [key: string]: any } | null => {
    if (!ptoControl || !leaveRemainingInDecimalControl) {
      return null;
    }

    const leaveRemainingInDecimal = leaveRemainingInDecimalControl.value;
    const pto = ptoControl.value;

    if (pto > leaveRemainingInDecimal) {
      return { 'remainingPtoInvalid': true };
    }

    return null;
  };
}

@Component({
  selector: 'app-check-in-out-table',
  templateUrl: './check-in-out-table.component.html',
  styleUrls: ['./check-in-out-table.component.css']
})

export class CheckInOutTableComponent implements OnInit {
  formPtoModal: any;
  isLoading = false; // Add a variable to control the loader
  employees: any[] = [];
  page: number = 1;
  count: number = 0;
  itemsPerPage: number = 20;
  searchTerm = "";
  id !: string;
  date: any;
  form: FormGroup;

  dynamicValue = 25;
  isProgress = false;

  payCycles : string[] = [];
  fromCycles : string[] = [];
  toCycles : string[] = [];

  isPayCycle: boolean = true
  payCycleForm!: any;
  userDropDownForm!: any;
  users: any[] = [];
  ptoEditForm!: any
  constructor(
    private spinner: NgxSpinnerService,
    private errorHandelService: ErrorHandelService,
    private employeeService: EmployeeService,
    private toastrService : ToastrService,
    private fb: FormBuilder,
    private excelService: ExcelService,
    private authService: AuthService,
    private userService: UserService,
    private utilService: UtilService,
    private cdr: ChangeDetectorRef,
    private leaveService: LeaveService,

  ) {
    const { payCycle, startCycle, endCycle} = this.authService.getPayCycle();
    this.payCycles = payCycle;
    this.fromCycles = startCycle;
    this.toCycles = endCycle;
    this.date = new Date()
    this.form = this.fb.group({
      fromDate: [""],
      toDate: [""],
    });
    this.ptoEditForm = this.fb.group({
      user: [""],
      payCycle: [""],
      PTOInDecimal: [],
      leaveUsedInDecimal: [],
      leaveRemainingInDecimal: [],
      tempLeaveRemainingInDecimal: [],
      adjustPto: [[Validators.required]]
    });

    this.ptoEditForm.get('adjustPto').setValidators([
      Validators.required,
      remainingPtoValidator(this.ptoEditForm.get('leaveRemainingInDecimal'))
    ]);

    this.payCycleForm = new FormControl('');
    this.userDropDownForm = new FormControl('');
  }


  ngOnInit(): any {
    this.formPtoModal = new window.bootstrap.Modal(
      document.getElementById('updatePtoModal')
    )
    this.getUsersDropdown()

    this.getPayCycle()
    this.payCycleForm.value = this.payCycles[0];
    this.authService.setEncryptedData(this.payCycleForm.value, "edit-url-cache");
    this.fetchEmployees(this.page, this.itemsPerPage, this.searchTerm, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value)
  }

  fetchEmployees(page: number, itemsPerPage: number, searchKey?: string, fromDate?:any, toDate?: any, payCycleValue?: any): any {
    this.spinner.show();
    this.employeeService.getEmployees(page, itemsPerPage, searchKey, fromDate, toDate, payCycleValue).subscribe({
      next: (res: any) => {
        this.employees = res.responseData.data;
        console.log(JSON.stringify(this.employees))
        this.date = res.responseData?.data[0]?.createdAt;
        this.count = res.responseData.total;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }


  onTableDataChange(event: any) {
    this.page = event;
    this.fetchEmployees(this.page, this.itemsPerPage, this.searchTerm, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value);
  }

  onSearch() {
    this.fetchEmployees(this.page, this.itemsPerPage, this.searchTerm, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value);
  }

  onFromDateChange() {
    console.log("..................", this.form.value?.fromDate)
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
    this.fetchEmployees(this.page, this.itemsPerPage, this.searchTerm, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value)
  }

  resetFilters() {
    this.searchTerm = "";
    this.isPayCycle = true;
    this.payCycleForm.reset()
    this.form.patchValue({toDate: "", fromDate: ""})
    this.fetchEmployees(this.page, this.itemsPerPage, this.searchTerm, this.form.value?.fromDate, this.form.value?.toDate, "")
  }


  async generateExcel() {
    console.log("Called excel sheet...........")
    this.isProgress = true;
    const res = await this.employeeService.getExcelExportEmployees(1, 1000, this.searchTerm, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value);
    if(res && res.responseData.data){
      let paycycle = ""
      if(!this.payCycleForm.value){
        paycycle = `${this.form.value?.fromDate}-${this.form.value?.toDate}`
      }else{
        paycycle = this.payCycleForm.value
      }
      this.excelService.timeSheetExcelExport(res.responseData.data, paycycle);
      this.isProgress = false;
    }else{
      this.isProgress = false;
      this.toastrService.error('Message Error!', "Invalid Data.");
    }
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
    console.log("this.payCycleForm.value", this.form.value)
    this.authService.setEncryptedData(this.payCycleForm.value, "edit-url-cache");
    this.fetchEmployees(this.page, this.itemsPerPage, this.searchTerm, this.form.value?.fromDate, this.form.value?.toDate, this.payCycleForm.value)
  }

  getUsersDropdown(): any {
    this.userService.getUsersDropdown().subscribe({
      next: (res: any) => {
        this.users = res.responseData;
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  // Update PTO
  onPtoUpdate(event: Event): void {
    event.preventDefault();
    this.formPtoModal.show()
  }
  cancelPtoUpdate() {
    console.log("Trigeeeeeeeeeeeeeeeeeee")
    this.cdr.detectChanges(); 
    this.ptoEditForm.reset();
    this.formPtoModal.hide();
  }

  updatePTO(): void {
    console.log('Updated PTO:', this.ptoEditForm.value);
    this.ptoEditForm.value.adjustPto = (+this.ptoEditForm.value.adjustPto)*60
    this.employeeService.adjustPTO(this.ptoEditForm.value).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);
        this.cancelPtoUpdate()
        this.ngOnInit()
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
        this.cancelPtoUpdate()
      }
    });
  }

  
  onUserSelect(event: any): void {
    const user = this.employees.find( d=> d.user.toString() === event.target.value.toString())
    console.log(user);
    if(user){
      this.isLoading = true;
      this.ptoEditForm.reset() // Show the loader
      this.leaveService.getBalanceLeave(user.user).subscribe({
        next: (res: any) => {
          user.leaveRemainingInDecimal = +user.leaveRemainingInDecimal
          if(res.responseData){
            if(user.leaveRemainingInDecimal > res.responseData.totalLeaveBalance){ 
              user.leaveRemainingInDecimal = res.responseData.totalLeaveBalance
            }
          }
          user.payCycle = this.payCycleForm.value;
          // user.tempLeaveRemainingInDecimal = +user.leaveRemainingInDecimal
          this.ptoEditForm.patchValue(user)
          this.isLoading = false
        },
        error: (err: any) => {
          this.isLoading = false
          this.errorHandelService.handleError(err);
        }
      });
    }else{
      this.ptoEditForm.reset()
    }
  }

  getEncodedName(data: string){
    return this.utilService.encrypt(JSON.stringify(data))
  }
}