import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorHandelService } from '../../services/error-handel.service'
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-pages-login',
  templateUrl: './pages-login.component.html',
  styleUrls: ['./pages-login.component.css']
})

export class PagesLoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private errorHandelService: ErrorHandelService,
    private toastrService: ToastrService,
    private userService : UserService,
    private employeeService : EmployeeService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.accountLogin(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (res: any) => {
        if (res.responseData.role === "ADMIN" || res.responseData.role === "SUB_ADMIN") {
          this.authService.setSession({ token: res.responseData.token, role: res.responseData.role, _id: res.responseData._id , name: res.responseData.name});
          this.toastrService.success('Success !', res.responseData.message);
          this.getUsersDropdown()
          this.getPayCycle()
          this.router.navigate(['/']);

        } else {
          this.router.navigate(['/pages-login']);
        }
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  getUsersDropdown(): any {
    this.userService.getUsersDropdown().subscribe({
      next: (res: any) => {
        this.authService.setEncryptedData(res.responseData, "user-dropdown");
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  // getSetting() {
  //   this.settingService.getSetting().subscribe({
  //     next: (res: any) => {
  //       this.authService.setWorkHrs(res.responseData);
  //     },
  //     error: (err: any) => {
  //       this.errorHandelService.handleError(err);
  //     }
  //   });
  // }

  getPayCycle(): any {
    this.employeeService.getPayCycle().subscribe({
      next: (res: any) => {
        this.authService.setPayCycle(res.responseData);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

}

