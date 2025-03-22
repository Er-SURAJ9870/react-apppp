import { ActivatedRoute } from '@angular/router';
import { ErrorHandelService } from '../../services/error-handel.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import { EditTimesheetReqService } from 'src/app/services/edit-timesheet-req.service';

@Component({
  selector: 'app-edit-timesheet-req',
  templateUrl: './edit-timesheet-req.component.html',
  styleUrls: ['./edit-timesheet-req.component.css']
})
export class EditTimesheetReqComponent implements OnInit {
  profile: any;
  timesheetptoReqs: any;
  id: any;
  page: number = 1;
  count: number = 0;
  itemsPerPage: number = 10;
  users: any[] = [];
  user: string = ""
  statusOptions = [
    { key: 'Pending', value: 'Pending' },
    { key: 'Approved', value: 'Approved' },
    { key: 'Denied', value: 'Cancelled' },
  ];
  isReloded = false;
  userDropDownForm!: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private errorHandelService: ErrorHandelService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastrService: ToastrService,
    private editTimesheetReqService: EditTimesheetReqService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userDropDownForm = new FormControl('');
    this.profile = this.authService.getSession();
    this.id = this.route.snapshot.params['id'];
    this.getUsersDropdown()
    this.fetchtimesheetptoReqs()
  }

  fetchtimesheetptoReqs(): any {
    this.spinner.show();
    this.editTimesheetReqService.getEditTimsheetReqs(this.page, this.itemsPerPage, this.userDropDownForm.value).subscribe({
      next: (res: any) => {
        this.timesheetptoReqs = res.responseData;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  // deleteLeave(id: string): void {
  //   this.editTimesheetReqService.deleteLeave(id).subscribe({
  //     next: (res: any) => {
  //       this.reloadWindow();
  //     },
  //     error: (err: any) => {
  //       this.errorHandelService.handleError(err);
  //     }
  //   });
  // }

  onTableDataChange(event: any) {
    this.page = event;
    this.fetchtimesheetptoReqs();
  }

  statusUpdate(id: string, status: string) {
    this.editTimesheetReqService.updateTimesheetReqStatus(id, { status }).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);        
        this.router.navigate(['/timesheet-edit-req']);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  reloadWindow(): void {
    window.location.reload();
  }

  getUsersDropdown(): any {
    this.spinner.show();
    this.userService.getUsersDropdown().subscribe({
      next: (res: any) => {
        this.users = res.responseData;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  onUserSelect(event: any): void {
    console.log("user.............", this.userDropDownForm.value)
    this.fetchtimesheetptoReqs()
  }
  
}






