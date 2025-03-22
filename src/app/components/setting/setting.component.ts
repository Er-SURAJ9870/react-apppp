import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandelService } from '../../services/error-handel.service';
import { SettingService } from '../../services/setting.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  profile: any
  changePasswordForm!: FormGroup;
  coordinatesForm!: FormGroup;
  settingForm: any;
  breakTimeForm: any;
  setting: any;
  notificationSettingForm: any;
  id: string = "";
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private errorHandelService: ErrorHandelService,
    private settingService: SettingService,
    private spinner: NgxSpinnerService,
  ) {
    this.profile = this.authService.getSession();
  }

  ngOnInit() {
    this.getSetting()

    // Setting form
    this.settingForm = this.formBuilder.group({
      businessName: [''],
      businessEmail: [''],
      businessContact: [''],
      address: [''],
      logo: this.formBuilder.group({
        imageUrl: [''],
        imageId: [''],
        imagePath: ['']
      })
    })

    // Break Setting form
    this.breakTimeForm = this.formBuilder.group({
      break1Time: [0],
      break2Time: [0],
      lunchTime: [0]
    })

    // Notification form
    this.notificationSettingForm = this.formBuilder.group({
      allowEmail: [false, Validators.required],
      allowNotification: [false, Validators.required],
    });


    // Coordinates
    this.coordinatesForm = this.formBuilder.group({
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      distanceLimit: [null, Validators.required]
    });

    if (this.profile._id) {
      this.authService.getAccountDetail().subscribe({
        next: (res: any) => {
          this.notificationSettingForm.patchValue(res.responseData);
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

  settingSubmit() {
    console.log("this.settingForm...............", this.settingForm.value)
    if (this.settingForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid input data");
      return;
    }
    this.settingService.settingUpdate(this.settingForm.value).subscribe({
      next: (res: any) => {
        this.ngOnInit();
        this.toastrService.success('Success !', res.responseData);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  breakSettingSubmit() {
    console.log("this.breakTimeForm...............", this.breakTimeForm.value)
    if (this.breakTimeForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid input data");
      return;
    }
    this.settingService.updateBreakTime(this.breakTimeForm.value).subscribe({
      next: (res: any) => {
        this.ngOnInit();
        this.toastrService.success('Success !', res.responseData);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  notificationSettingSubmit() {
    if (this.notificationSettingForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid input data");
      return;
    }
    this.authService.updateProfileSetting(this.notificationSettingForm.value).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  coordinatesSettingSubmit() {
    console.log(this.coordinatesForm.value)
    if (this.coordinatesForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid input data");
      return;
    }
    const location = {
      "type": "Point",
      "coordinates": [this.coordinatesForm.value.longitude, this.coordinatesForm.value.latitude]
    }
    const payload = {
      distanceLimit: this.coordinatesForm.value.distanceLimit,
      location
    }
    console.log("mmmmmmmmmmmmmmmmmm", JSON.stringify(payload))
    this.settingService.updateGeoLocation(payload).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }
  
  uploadImage(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file);
      this.authService.fileUpload(formData).subscribe({
        next: (res: any) => {
          console.log("File res...", res)
          this.settingForm.patchValue({
            logo: {
              imageUrl: res.responseData.imageUrl,
              imageId: res.responseData.imageId,
              imagePath: res.responseData.imagePath
            }
          });
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

  getPreviewImage(): string {
    return this.settingForm.value?.logo?.imageUrl;
  }

  getSetting() {
    this.spinner.show();
    this.settingService.getSetting().subscribe({
      next: (res: any) => {
        this.setting = res.responseData;
        this.settingForm.patchValue(res.responseData);
        this.breakTimeForm.patchValue(res.responseData);
        this.coordinatesForm.patchValue({
          longitude: res.responseData.location.coordinates[0],
          latitude:  res.responseData.location.coordinates[1],
          distanceLimit: res.responseData.distanceLimit
        })
        this.spinner.hide();
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  

  deleteImage(): any {
    this.settingForm.patchValue({
      logo: {
        imageUrl: "",
        imageId: "",
        imagePath: ""
      }
    });
  }

  formatMobileNumber(mobileNumber: any): any {
    const formattedNumber = mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return formattedNumber;
  }

  
}


