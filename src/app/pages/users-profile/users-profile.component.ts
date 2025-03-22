import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { UtilService } from '../../services/util.service';
import { ErrorHandelService } from '../../services/error-handel.service';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UsersProfileComponent implements OnInit {
  profile : any
  changePasswordForm!: FormGroup;
  submitted = false;
  userForm: any;
  userDetail!: User;
  profileSettingForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private errorHandelService: ErrorHandelService
  ) { 
    this.profile = this.authService.getSession();
  }

  ngOnInit() {

    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.userForm = this.formBuilder.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      mobileNumber: [''],
      countryCode: ['+1'],
      email: [''],
      imageUrl: [null],
      imageId: [null],
      imagePath: [null]
    })

    this.profileSettingForm = this.formBuilder.group({
      allowEmail: [false, Validators.required],
      allowNotification: [false, Validators.required],
    });

    if (this.profile._id) {
      this.authService.getAccountDetail().subscribe({
        next: (res: any) => {
          this.userForm.patchValue(res.responseData);
          this.profileSettingForm.patchValue(res.responseData);
          this.userDetail = res.responseData;
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    }
  }


  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid input data");
      return;
    }
    if (this.changePasswordForm.value.confirmPassword !== this.changePasswordForm.value.newPassword) {
      this.toastrService.error('Message Error!', "New password and confirm password do not match.");
      return;
    } else {
      this.authService.changePassword(this.changePasswordForm.value).subscribe({
        next: (res: any) => {
          this.changePasswordForm.reset();
          this.toastrService.success('Success !', res.responseData);
          this.authService.logout()
          this.router.navigate(['/pages-login']);
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

  profileSubmit() {
    console.log("this.userForm", this.userForm.value)
    this.submitted = true;
    if (this.userForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid input data");
      return;
    }
    this.authService.updateProfile(this.userForm.value).subscribe({
      next: (res: any) => {
        this.ngOnInit();
        this.toastrService.success('Success !', res.responseData);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  profileSettingSubmit() {
    this.submitted = true;
    if (this.profileSettingForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid input data");
      return;
    }
    this.authService.updateProfileSetting(this.profileSettingForm.value).subscribe({
      next: (res: any) => {
        this.ngOnInit();
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
          this.userForm.patchValue({
            imageUrl: res.responseData.imageUrl,
            imageId: res.responseData.imageId,
            imagePath: res.responseData.imagePath
          });
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

  getPreviewImage(): string {
    return this.userForm.value?.imageUrl;;
  }

  deleteImage() : any {
    this.userForm.patchValue({
      imageUrl: null,
      imageId: null,
      imagePath: null
    });
  }

  formatMobileNumber(mobileNumber: any): any {
    const formattedNumber = mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return formattedNumber;
  }
}

