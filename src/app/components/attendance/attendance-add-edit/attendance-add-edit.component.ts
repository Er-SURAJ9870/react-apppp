import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandelService } from '../../../services/error-handel.service'
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { SettingService } from '../../../services/setting.service';
declare var window: any;

@Component({
  selector: 'app-attendance-add-edit',
  templateUrl: './attendance-add-edit.component.html',
  styleUrls: ['./attendance-add-edit.component.css']
})

export class AttendanceAddEditComponent implements OnInit {
  formModal: any;
  deleteFormModal: any;
  @ViewChild('startPicker') startPicker!: MatDatepicker<any>;
  datePipe = new DatePipe('en-US');
  loading = true;
  today = new Date();
  addForm!: FormGroup;
  submitted = false;
  id?: string;
  user!: string;
  createdAt = Date();
  dayData!: string[];
  flag = false
  workingHoursData: any;
  title = "Add Timesheet"
  tempName = ""
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private errorHandelService: ErrorHandelService,
    private settingService: SettingService,
  ) {
    this.dayData = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    this.workingHoursData = []
    this.id = this.route.snapshot.params['id'];

    this.route.queryParams.subscribe(params => {
      this.tempName = params['name']
    });
  }

  async ngOnInit() {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('cancelModal')
    )

    this.deleteFormModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    )
    if (this.id) {
      this.flag = true;
    }
    this.route.queryParams.subscribe(params => {
      this.user = params['id'];
    });

    this.getSetting(this.user);
    this.spinner.show();

    this.addForm = this.formBuilder.group({
      createdAt: new FormControl(null, Validators.required),
      checkIn: ['08:00', [Validators.required]],
      inMediterian: ['AM'],
      outMediterian: ['PM'],
      checkOut: ['05:00', [Validators.required]],
      break2: new FormControl(false, Validators.required),
      break1: new FormControl(true, Validators.required),
      lunch: new FormControl(true, Validators.required),
      user: new FormControl("", Validators.required),
      remarks: new FormControl("")
    })

    if (this.user) this.addForm.patchValue({ user: this.user });

    if (this.id) {
      this.title = 'Edit Timesheet';
      await this.getTimesheetById(this.id)
      this.spinner.hide();

      this.loading = true;
    } else {
      this.loading = true;
      this.spinner.hide();
    }
  }

  async getTimesheetById(id: string) {
    try {
      const res: any = await this.employeeService.getWorkTime(id).toPromise();
      if (res && res.responseData) {
        res.responseData.break1 =  true;
        res.responseData.break2 = false
        //res.responseData.break2 === true ? true: false;
        res.responseData.lunch = true;
        this.addForm.patchValue(res.responseData);
        if (!res.responseData.checkIn) {
          this.addForm.get('checkIn')?.setValue(res.responseData?.checkInTimeSystemSet.split(" ")[0]);
          this.addForm.get('inMediterian')?.setValue(res.responseData?.checkInTimeSystemSet.split(" ")[1]);
        } else {
          this.addForm.get('checkIn')?.setValue(res.responseData?.checkIn.split(" ")[0]);
          this.addForm.get('inMediterian')?.setValue(res.responseData?.checkIn.split(" ")[1]);
        }

        if (!res.responseData.checkOut) {
          this.addForm.get('checkOut')?.setValue(res.responseData?.checkOutTimeSystemSet.split(" ")[0]);
          this.addForm.get('outMediterian')?.setValue(res.responseData?.checkOutTimeSystemSet.split(" ")[1]);
        } else {
          this.addForm.get('checkOut')?.setValue(res.responseData?.checkOut.split(" ")[0]);
          this.addForm.get('outMediterian')?.setValue(res.responseData?.checkOut.split(" ")[1]);
        }

      } else {
        console.error("Invalid response or responseData is missing:", res);
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    }
  }

  convertToTimeFormat(input: string, me: string): string {
    if (me) {
      if (input && input.length === 4) {
        const hours = input.substring(0, 2);
        const minutes = input.substring(2);
        return `${hours}:${minutes} ${me}`;
      } else {
        if (input.includes("AM") || input.includes("PM")) {
          return input;
        } else {
          return `${input} ${me}`;
        }
      }
    } else {
      return input
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid Data.");
      return;
    }
    this.addForm.value.checkIn = this.convertToTimeFormat(this.addForm.value.checkIn, this.addForm.value.inMediterian);
    this.addForm.value.checkOut = this.convertToTimeFormat(this.addForm.value.checkOut, this.addForm.value.outMediterian);
    delete this.addForm.value.inMediterian;
    delete this.addForm.value.outMediterian;

    console.log("Final form", this.addForm.value)
    this.spinner.show();

    if (this.id) {
      this.employeeService.updateWorkTime(this.id, this.addForm.value).subscribe({
        next: (res: any) => {
          this.toastrService.success('Success !', res.responseData);
          this.spinner.hide();

          const queryParams: NavigationExtras = {
            queryParams: {
              name: this.tempName
            }
          };
          this.router.navigate(['/employee-attendance/detail', this.addForm.value.user], queryParams);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.errorHandelService.handleError(err);
        }
      });
    } else {
      this.employeeService.addWorkTime(this.addForm.value).subscribe({
        next: (res: any) => {
          this.toastrService.success('Success !', res.responseData);
          this.spinner.hide();
          const queryParams: NavigationExtras = {
            queryParams: {
              name: this.tempName
            }
          };
          this.router.navigate(['/employee-attendance/detail', this.user], queryParams);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

  getSetting(id: string) {
    this.spinner.show();
    this.settingService.getWorkHrsSetting(id).subscribe({
      next: (res: any) => {
        this.workingHoursData = res.responseData.workingHours;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  // On cancel 
  onCancelEvent(event: Event): void {
    event.preventDefault();
    this.formModal.show()
  }

  noCancel() {
    this.formModal.hide()
  }

  onCancel() {
    const queryParams: NavigationExtras = {
      queryParams: {
        name: this.tempName
      }
    };
    this.router.navigate(['/employee-attendance/detail', this.addForm.value.user], queryParams);
  }

  // ---------------------------------------------------------------------

  // On delete
  onDeleteEvent(event: Event) {
    event.preventDefault();
    this.deleteFormModal.show()
  }

  noDelete() {
    this.deleteFormModal.hide()
  }

  onDelete() {
    if (this.id) {
      this.spinner.show();
      this.employeeService.deleteWorkTime(this.id).subscribe({
        next: (res: any) => {
          this.toastrService.success('Success !', res.responseData);
          this.spinner.hide();
          const queryParams: NavigationExtras = {
            queryParams: {
              name: this.tempName
            }
          };
          this.router.navigate(['/employee-attendance/detail', this.addForm.value.user], queryParams);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

}























// const createdAt = new Date(this.addForm.get('createdAt')?.value);
// if (createdAt) {
//   const dayCode = createdAt.getDay();
//   if (this.dayData[dayCode]) {
//     const getWrk = this.workingHoursData?.find((d: any) => d.day === this.dayData[dayCode])
//     if (getWrk) {
//       if(!res.responseData.checkIn){
//         this.addForm.get('checkIn')?.setValue(getWrk.openTime);
//         this.addForm.get('inMediterian')?.setValue(getWrk.inMediterian);
//       }else{
//         this.addForm.get('checkIn')?.setValue(res.responseData?.checkIn.split(" ")[0]);
//         this.addForm.get('inMediterian')?.setValue(res.responseData?.checkIn.split(" ")[1]);
//       }
//       if(!res.responseData.checkOut){
//         this.addForm.get('checkOut')?.setValue(getWrk.closeTime);
//         this.addForm.get('outMediterian')?.setValue(getWrk.outMediterian);
//       }else{
//         this.addForm.get('checkOut')?.setValue(res.responseData?.checkOut.split(" ")[0]);
//         this.addForm.get('outMediterian')?.setValue(res.responseData?.checkOut.split(" ")[1]);
//       }
//     }
//   }
// }
