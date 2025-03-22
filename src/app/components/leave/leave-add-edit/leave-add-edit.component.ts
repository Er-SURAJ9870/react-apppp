import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandelService } from '../../../services/error-handel.service'
import { UserService } from '../../../services/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LeaveService } from '../../../services/leave.service'
import { UtilService } from '../../../services/util.service'
declare var window: any;

@Component({
  selector: 'app-leave-add-edit',
  templateUrl: './leave-add-edit.component.html',
  styleUrls: ['./leave-add-edit.component.css']
})
export class LeaveAddEditComponent implements OnInit {
  loading = false;
  minDate: Date; // Declare minDate property in your component

  formModal: any;
  today = new Date();
  addForm!: FormGroup;
  employees: { _id: string, name: string }[]
  timeOffTypes: string[]
  openTimeOptions!: string[];
  closeTimeOptions!: string[];
  leaveValue: number = 8
  user = null;
  date = null;
  id!: string;
  title: string = "Add Time-Off";
  tempLeaveReq = 0
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private errorHandelService: ErrorHandelService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private leaveService: LeaveService,
    private utilService: UtilService,
    private route: ActivatedRoute,
  ) {
    this.employees = [];
    this.timeOffTypes = ["Paid Time Off", "Unpaid Time Off"]
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
  }

  async ngOnInit() {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    )
    this.id = this.route.snapshot.params['id'];
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.user = params['id'];
      } if (params['date']) {
        this.date = params['date']
      }
      console.log("params.........................", params)
    });
    console.log(" user id...........", this.user)
    await this.getUsersDropdown();
    this.openTimeOptions = this.utilService.generateTimeOptions();
    this.closeTimeOptions = this.utilService.generateTimeOptions();

    this.addForm = this.formBuilder.group({
      _id: [null],
      user: [this.user, Validators.required],
      reasons: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      leaveType: [null, Validators.required],
      isAllDay: [true, Validators.required],
      openTime: ["08:00"],
      inMediterian: ["AM"],
      closeTime: ["01:00"],
      outMediterian: ["PM"],
      totalReqTime: [0],
      totalLeaveBalance: [0],
    });

    if (this.user) {
      await this.getTotalLeaveBalance(this.user)
    }

    if (this.id) {
      this.title = 'Edit Time-Off';
      await this.getLeaveById(this.id)
      this.loading = true;
    } else {
      this.loading = true;
      this.spinner.hide();
    }
  }


  onTimeOffType(event: any) {
    console.log('Toggle switch changed:');
    this.addForm.patchValue({ endDate: null, startDate: null, totalReqTime: 0, openTime: null, closeTime: null })
    console.log('Toggle switch changed:', this.addForm.value);
  }

  onToggle(event: any) {
    console.log('Toggle switch changed:', event.target.checked);
    this.addForm.patchValue({ endDate: null, startDate: null, totalReqTime: 0, openTime: null, closeTime: null })
    console.log('Toggle switch changed:', this.addForm.value);
  }

  onTimeChange(event: any) {
    this.reCalculation()
  }

  onSubmit(): void {
    if (!this.addForm.value.isAllDay) {
      this.addForm.value.endDate = this.addForm.value.startDate
    }
    console.log("mt ttttttttttt", this.addForm.value)
    // if (this.addForm.invalid) {
    //   this.toastrService.error('Message Error!', "Invalid Data.");
    //   return;
    // }
    if (this.addForm.value.startDate > this.addForm.value.endDate) {
      this.toastrService.error('Message Error!', "From-date must be less than or equal to To-date");
      return;
    }

    if (!this.addForm.value.isAllDay) {
      this.addForm.value.fromTime = `${this.addForm.value.openTime} ${this.addForm.value.inMediterian}`
      this.addForm.value.toTime = `${this.addForm.value.closeTime} ${this.addForm.value.outMediterian}`
    }

    delete this.addForm.value.openTime;
    delete this.addForm.value.inMediterian;
    delete this.addForm.value.closeTime;
    delete this.addForm.value.outMediterian;

    if (this.id) {
      this.addForm.value._id = this.id
    }
    console.log("Final submit", this.addForm.value)

    this.leaveService.addLeave(this.addForm.value).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);
        this.router.navigate(['/leave']);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }


  async getUsersDropdown() {
    this.spinner.show();
    const userData = await this.userService.getUsersDropdown().toPromise();
    this.employees = userData.responseData;
    console.log('My users........................', this.employees)
    this.spinner.hide();
  }

  reCalculation() {
    if (this.addForm.value.isAllDay) {
      const dateDiff = this.calculateDateDifference();
      console.log("recalllllllllllllll", { dateDiff });
      this.addForm.patchValue({ totalReqTime: dateDiff * this.leaveValue });
      console.log("recal updated data............", this.addForm.value);
    } else {
      const timeDiff = this.calculateTimeDifference();
      this.addForm.patchValue({ totalReqTime: timeDiff });
      console.log("recalllllllllllllll", { timeDiff });
    }
  }


  async getTotalLeaveBalance(id: string) {
    try {
      const res: any = await this.leaveService.getBalanceLeave(id).toPromise();
      if (res && res.responseData) {
        console.log("leave resssssssssssssss", res.responseData.totalLeaveBalance);
        this.tempLeaveReq = res.responseData.totalLeaveBalance + this.tempLeaveReq
        this.addForm.patchValue({ totalLeaveBalance: this.tempLeaveReq });
      } else {
        console.error("Invalid response or responseData is missing:", res);
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    }
  }

  async getLeaveById(id: string) {
    try {
      const res: any = await this.leaveService.getLeave(id).toPromise();
      if (res && res.responseData) {
        console.log("leave by id", res.responseData);
        if (res.responseData.fromTime) {
          this.addForm.get('openTime')?.setValue(res.responseData?.fromTime.split(" ")[0]);
          this.addForm.get('inMediterian')?.setValue(res.responseData?.fromTime.split(" ")[1]);
        }
        if (res.responseData.toTime) {
          this.addForm.get('closeTime')?.setValue(res.responseData?.toTime.split(" ")[0]);
          this.addForm.get('outMediterian')?.setValue(res.responseData?.toTime.split(" ")[1]);
        }
        if(res.responseData.leaveType === "Paid Time Off"){
          this.tempLeaveReq = res.responseData.totalReqTime + this.tempLeaveReq
          this.addForm.patchValue({ totalLeaveBalance: this.tempLeaveReq });
        }
        this.addForm.patchValue(res.responseData);
      } else {
        console.error("Invalid response or responseData is missing:", res);
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    }
  }

  async onUserSelect(event: any) {
    const selectedUserId = event.target.value;
    await this.getTotalLeaveBalance(selectedUserId)
  }

  onFromDateChange(newDate: any) {
    this.addForm.patchValue({ endDate: null, totalReqTime: 0 })
  }


  onToDateChange(newDate: any) {
    if (!this.addForm.value.startDate) {
      this.addForm.patchValue({ endDate: null })
      this.toastrService.error('Message Error!', "First select Start date.");
    }
    if (this.addForm.value.startDate > this.addForm.value.endDate) {
      this.toastrService.error('Message Error!', "Invalid to date.");
    }
    this.reCalculation()
  }

  partialLeaveDateChange(newDate: any) {
    this.addForm.patchValue({ endDate: newDate })
    this.reCalculation()
  }

  calculateDateDifference(): any {
    const startDate = new Date(this.addForm.value.startDate)
    const endDate = new Date(this.addForm.value.endDate)
    const timeDifference = startDate.getTime() - endDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const temp = Math.abs(Math.round(daysDifference)) + 1;
    console.log("okkkkkkkkkkkkkkkkkkkkk", {startDate, endDate, timeDifference, daysDifference, temp})

    return temp
  }

  calculateTimeDifference() {
    const openTimeParts = this.addForm.value.openTime.split(':');
    const closeTimeParts = this.addForm.value.closeTime.split(':');
    let openHours = parseInt(openTimeParts[0]);
    let openMinutes = parseInt(openTimeParts[1]);
    let closeHours = parseInt(closeTimeParts[0]);
    let closeMinutes = parseInt(closeTimeParts[1]);
    if (this.addForm.value.inMediterian === 'PM') {
      openHours += 12;
    }
    if (this.addForm.value.outMediterian === 'PM') {
      closeHours += 12;
    }
    const hoursDifference = closeHours - openHours;
    const minutesDifference = closeMinutes - openMinutes;
    return hoursDifference + minutesDifference / 60;
  }


  onCancel(event: Event): void {
    event.preventDefault();
    this.formModal.show()
  }

  onDelete() {
    this.formModal.hide()
    this.router.navigate(['/leave']);
  }
  noDelete() {
    this.formModal.hide()
  }

}

