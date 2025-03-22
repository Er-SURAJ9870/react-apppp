import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { UtilService } from '../../services/util.service';
import { ErrorHandelService } from '../../services/error-handel.service';
import { SettingService } from '../../services/setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-work-hr-setting',
  templateUrl: './work-hr-setting.component.html',
  styleUrls: ['./work-hr-setting.component.css']
})
export class WorkHrSettingComponent implements OnInit {
  workingHrForm: any;
  workingHoursData: any;
  workingHoursArray: any;
  openTimeOptions!: string[];
  closeTimeOptions!: string[];
  users: any[] = [];
  userDropDownForm!: any;
  id: string = "";
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private errorHandelService: ErrorHandelService,
    private settingService: SettingService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private router: Router,

  ) {
    this.workingHoursData = []
  }

  ngOnInit() {
    this.userDropDownForm = new FormControl('');
    if(this.authService.getEncryptedData("user-dropdown")){
      this.userDropDownForm.value = this.authService.getEncryptedData("user-dropdown")[0]?._id;
    }
    this.getUsersDropdown()
    this.getUserSetting(this.userDropDownForm.value)
    this.openTimeOptions = this.utilService.generateTimeOptions();
    this.closeTimeOptions = this.utilService.generateTimeOptions();

    // Working hr form
    this.workingHrForm = this.formBuilder.group({
      workingHours: this.formBuilder.array([])
    });
    this.workingHoursArray = this.workingHrForm.get('workingHours') as FormArray;

  }

  workingFormSubmit() {
    console.log("Working Hr Form", this.workingHrForm.value)
    if (this.workingHrForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid input data");
      return;
    }
    this.settingService.updateWorkingHrs(this.workingHrForm.value, this.userDropDownForm.value).subscribe({
      next: (res: any) => {
        this.ngOnInit();
        this.toastrService.success('Success !', res.responseData);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  setWrkingHrs() {
    console.log("okkkkkkkkkkkkkkkk", this.workingHoursArray)
    this.workingHoursData.forEach((day:any) => {
      const dayFormGroup = this.formBuilder.group({
        day: [day.day],
        isOpen: [day.isOpen],
        openTime: [day.openTime],
        closeTime: [day.closeTime],
        inMediterian: [day.inMediterian],
        outMediterian: [day.outMediterian]
      });
      this.workingHoursArray.push(dayFormGroup);
    });
    console.log("okkkkkkkkkkkkkkkk@@@@@@@@@@@@@@@@@", this.workingHoursArray)
  }

  getUserSetting(id: string) {
    this.spinner.show();
    this.settingService.getWorkHrsSetting(id).subscribe({
      next: (res: any) => {
        this.workingHoursData = res.responseData.workingHours;
        console.log("this.workingHoursData", this.workingHoursData)
        // this.workingHrForm.patchValue(res.responseData)
        this.setWrkingHrs()
        this.spinner.hide();
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  
  getUsersDropdown(): any {
    this.spinner.show();
    this.userService.getUsersDropdown().subscribe({
      next: (res: any) => {
        this.users = res.responseData;
        this.authService.setEncryptedData(this.users, "user-dropdown");
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  onUserSelect(event: any): void {
    this.userDropDownForm.value = event.target.value;
    console.log("user id", this.userDropDownForm.value);
    this.workingHoursArray.clear();
    this.getUserSetting(this.userDropDownForm.value);
  }

  modifyExceptionalWorkHrs(){
    this.router.navigate(['/working-hrs/exceptional-work-hrs', this.userDropDownForm.value]);
  }
  
}



