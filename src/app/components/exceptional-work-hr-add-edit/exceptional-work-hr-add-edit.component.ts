import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandelService } from '../../services/error-handel.service'
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { SettingService } from '../../services/setting.service';
import { AuthService } from '../../services/auth.service';
import { UtilService } from 'src/app/services/util.service';
declare var window: any;

@Component({
  selector: 'app-exceptional-work-hr-add-edit',
  templateUrl: './exceptional-work-hr-add-edit.component.html',
  styleUrls: ['./exceptional-work-hr-add-edit.component.css']
})
export class ExceptionalWorkHrAddEditComponent implements OnInit {
  formModal: any;
  deleteFormModal: any;
  @ViewChild('startPicker') startPicker!: MatDatepicker<any>;
  datePipe = new DatePipe('en-US');
  loading = true;
  addForm!: FormGroup;
  submitted = false;
  id?: string = "";
  userId!: string;
  flag = false
  workingHoursData: any;
  title = "Modify Hours";
  data : any
  openTimeOptions!: string[];
  closeTimeOptions!: string[];
  constructor(
    private formBuilder:  FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private errorHandelService: ErrorHandelService,
    private authService: AuthService,
    private settingService: SettingService,
    private utilService: UtilService

  ) {
    this.workingHoursData = []
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        const encryptedData = params['data'];
        const decryptedData = JSON.parse(this.utilService.decrypt(encryptedData));
        this.data = decryptedData
      }
      if (params['userId']) {
        console.log("params['id'].................", params['userId']);
        this.userId = params['userId']
      }
    });
    this.openTimeOptions = this.utilService.generateTimeOptions();
    this.closeTimeOptions = this.utilService.generateTimeOptions();
  }

  ngOnInit() {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('cancelModal')
    )

    // this.deleteFormModal = new window.bootstrap.Modal(
    //   document.getElementById('deleteModal')
    // )
    if (this.data) {
      this.flag = true;
    }
    
    this.addForm = this.formBuilder.group({
      _id: [""],
      date: new FormControl(null, Validators.required),
      openTime: ['08:00', [Validators.required]],
      inMediterian: ['AM'],
      outMediterian: ['PM'],
      closeTime: ['05:00', [Validators.required]],
      user: new FormControl(this.userId, Validators.required),
    })

    if (this.data) {
      this.title = "Edit Work Time";
      this.addForm.patchValue(this.data);
    }
  }


  onSubmit(): void {
    this.submitted = true;
    console.log("Final form", JSON.stringify(this.addForm.value))

    if (this.addForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid Data.");
      return;
    }
    console.log("Final form", JSON.stringify(this.addForm.value))
    this.spinner.show();
    this.settingService.updateExceptionalWorkHrs(this.addForm.value).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);
        this.spinner.hide();
        this.router.navigate(['/working-hrs/exceptional-work-hrs', this.addForm.value.user]);
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

  onCancel(){
    this.router.navigate(['/working-hrs/exceptional-work-hrs', this.addForm.value.user]);
  }

  // ---------------------------------------------------------------------

  // On delete
  // onDeleteEvent(event: Event){
  //   event.preventDefault();
  //   this.deleteFormModal.show()
  // }

  // noDelete() {
  //   this.deleteFormModal.hide()
  // }

  // onDelete(){
  //   if (this.id) {
  //     this.spinner.show();
  //     this.employeeService.deleteWorkTime(this.id).subscribe({
  //       next: (res: any) => {
  //         this.toastrService.success('Success !', res.responseData);
  //         this.spinner.hide();
  //         this.router.navigate(['working-hrs/exceptional-work-hrs', this.addForm.value.user]);
  //       },
  //       error: (err: any) => {
  //         this.spinner.hide();
  //         this.errorHandelService.handleError(err);
  //       }
  //     });
  //   }
  // }

}
