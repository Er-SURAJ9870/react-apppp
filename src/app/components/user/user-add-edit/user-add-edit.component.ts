import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandelService } from '../../../services/error-handel.service'
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../services/user.service'
import { EmployeeService } from 'src/app/services/employee.service';
declare var window: any;

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css']
})
export class UserAddEditComponent implements OnInit {
  formDeleteModal: any;
  formRateModal: any;
  @ViewChild('startPicker') startPicker!: MatDatepicker<any>;
  datePipe = new DatePipe('en-US');
  loading = true;
  today = new Date();
  employeeTypes = ["Part-time", "Full-time", "Inactive"];
  payTypes = ["Annual", "Hourly"];
  title = 'Add  Employee';
  roles = ["USER", "SUB_ADMIN"];

  titles = [
    "Cultivation Tech.",
    "Compliance Manager",
    "Director of Cultivation",
    "Flower 1 Room Lead",
    "Flower 2 Room Lead",
    "Flower 3 Room Lead",
    "Flower 4 Room Lead",
    "Veg Room Lead",
    "Mom/Clone Room Lead",
    "Dry Trim Room Lead",
    "Processing Lead",
    "Shift Supervisor",
    "Packaging Lead"
  ];
  payRateHistory: any[] = [];

  addForm!: FormGroup;
  submitted = false;
  id!: string;
  createdAt = Date();
  isLoader = false;
  passwordVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private errorHandelService: ErrorHandelService,
    private userService: UserService,
    private employeeService: EmployeeService,

  ) { }

  ngOnInit() {
    this.formDeleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    )

    this.formRateModal = new window.bootstrap.Modal(
      document.getElementById('updatePayRateHistoryModal')
    )

    this.getPayCycle()
    this.spinner.show();
    this.id = this.route.snapshot.params['id'];

    this.addForm = this.formBuilder.group({
      firstName: new FormControl(null, Validators.required),
      middleName: new FormControl(null),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      mobileNumber: new FormControl("", Validators.required),
      password: new FormControl(null),
      dob: new FormControl(null, Validators.required),
      employeeType: new FormControl("Permanent", Validators.required),
      payRate: new FormControl(null, Validators.required),
      imageUrl: [""],
      imageId: [""],
      imagePath: [""],
      role: new FormControl("USER", Validators.required),
      title: new FormControl("", Validators.required),
      startDate: new FormControl(null, Validators.required),
      lastDate: new FormControl(null),
      payType: new FormControl("Hourly", Validators.required),
      socialSecurity: new FormControl("", Validators.required),
      address: this.formBuilder.group({
        address1: new FormControl(null, Validators.required),
        address2: new FormControl(null),
        state: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        zipcode: new FormControl("", Validators.required)
      }),
      emergencyContactName: [""],
      emergencyContactPhone: [""],
      payRateEffectiveDate: [""]
    })



    if (this.id) {
      this.title = 'Edit Employee';
      console.log("uyduygudyug", this.addForm.value)

      this.userService.getUser(this.id).subscribe({
        next: (res: any) => {
          this.addForm.patchValue(res.responseData);
          this.createdAt = res.responseData.createdAt;
          this.payRateHistory = res.responseData.payRateHistory
          this.loading = true;
          this.spinner.hide();
        },
        error: (err: any) => {
          this.loading = true;
          this.spinner.hide();
          this.errorHandelService.handleError(err);
        }
      });
    } else {
      this.loading = true;
      this.spinner.hide();
    }
  }



  onSubmit(): void {
    this.submitted = true;
    console.log("uyduygudyug", this.addForm)
    Object.keys(this.addForm.controls).forEach(controlName => {
      const control = this.addForm.controls[controlName];
      if (control.invalid) {
        console.log(`Validation errors for ${controlName}:`, control.errors);
      }
    });

    if (this.addForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid Data.");
      return;
    }

    if (this.id) {
      delete this.addForm.value.password;
      this.userService.updateAccount(this.id, this.addForm.value).subscribe({
        next: (res: any) => {
          this.toastrService.success('Success !', res.responseData);
          this.router.navigate(['/user']);
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    } else {
      this.userService.addAccount(this.addForm.value).subscribe({
        next: (res: any) => {
          this.toastrService.success('Success !', res.responseData);
          this.router.navigate(['/user']);
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    }
  }


  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('yourPassword') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  getPreviewImage(): string {
    return this.addForm.value?.imageUrl;;
  }

  uploadImage(event: any) {
    this.isLoader = true;
    const file = event.target.files && event.target.files[0];
    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file);
      this.authService.fileUpload(formData).subscribe({
        next: (res: any) => {
          this.addForm.patchValue({
            imageUrl: res.responseData.imageUrl,
            imageId: res.responseData.imageId,
            imagePath: res.responseData.imagePath
          });
          this.isLoader = false;
        },
        error: (err: any) => {
          this.isLoader = false;
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

  getPayCycle(): any {
    this.employeeService.getPayCycle().subscribe({
      next: (res: any) => {
        this.authService.setPayCycle(res.responseData)
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  formCancel(event : Event){
    this.router.navigate(['/user']);
  }

  // Cancel event
  noDelete() {
    this.id = "";
    this.formDeleteModal.hide()
  }
  onDelete() {
    this.router.navigate(['/user']);
  }
  onCancel(event: Event): void {
    event.preventDefault();
    this.formDeleteModal.show()
  }

  // Update Rate history
  onRateUpdate(event: Event): void {
    event.preventDefault();
    this.formRateModal.show()
  }
  cancelRateUpdate() {
    this.formRateModal.hide()
  }

  updatePayRateHistory(): void {
    console.log('Updated payRateHistory:', this.id, this.payRateHistory);
    this.userService.updatePayRate(this.id, {payRateHistory: this.payRateHistory}).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);
        this.cancelRateUpdate()
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }
}

