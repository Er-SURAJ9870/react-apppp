import { ActivatedRoute } from '@angular/router';
import { ErrorHandelService } from '../../../services/error-handel.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeaveService } from '../../../services/leave.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PtoReqService } from '../../../services/pto-req.service';
import { EditTimesheetReqService } from 'src/app/services/edit-timesheet-req.service';
import { Tab, initMDB } from 'mdb-ui-kit';

declare var window: any;

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit, AfterViewInit {
  formModal: any;
  profile: any;
  leaves: any;
  ptoReqs: any;
  timesheetPtoReqs: any;
  id: any;
  page: number = 1;
  count: number = 0;
  countpto: number = 0;
  countptotimesheet: number = 0;
  itemsPerPage: number = 10;
  users: any[] = [];
  user: string = "";
  statusOptions = [
    { key: 'Pending', value: 'Pending' },
    { key: 'Approved', value: 'Approved' },
    { key: 'Denied', value: 'Cancelled' },
  ];
  isReloded = false;
  userDropDownForm!: FormControl;
  updateForm!: FormGroup;
  timeOffCount = 0;
  PTOreqCount = 0;
  timesheetReqCount = 0;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private errorHandelService: ErrorHandelService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastrService: ToastrService,
    private leaveService: LeaveService,
    private userService: UserService,
    private ptoReqService: PtoReqService,
    private editTimesheetReqService: EditTimesheetReqService
  ) { }

  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('updateModal')
    );
    this.userDropDownForm = new FormControl('');
    this.updateForm = this.formBuilder.group({
      status: [null, Validators.required],
      adminReason: [null, Validators.required],
      id: [null, Validators.required],
    });
    this.profile = this.authService.getSession();
    this.id = this.route.snapshot.params['id'];
    this.getUsersDropdown();
    this.fetchLeave();
    this.fetchPtoReqs();
    this.fetchTimesheetPtoReqs();
    this.getAllReqCounts(); // Fetch the counts on component initialization
  }

  fetchLeave(): void {
    this.spinner.show();
    this.leaveService.getLeaves(this.page, this.itemsPerPage, this.userDropDownForm.value).subscribe({
      next: (res: any) => {
        this.leaves = res.responseData.data;
        this.count = res.responseData.total;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  fetchPtoReqs(): void {
    this.spinner.show();
    this.ptoReqService.getEditPTOReqs(this.page, this.itemsPerPage, this.userDropDownForm.value).subscribe({
      next: (res: any) => {
        this.ptoReqs = res.responseData;
        this.countpto = res.responseData.total;

        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  fetchTimesheetPtoReqs(): void {
    this.spinner.show();
    this.editTimesheetReqService.getEditTimsheetReqs(this.page, this.itemsPerPage, this.userDropDownForm.value).subscribe({
      next: (res: any) => {
        this.timesheetPtoReqs = res.responseData;
        this.countptotimesheet = res.responseData.total;

        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  getAllReqCounts(): void {
    this.ptoReqService.getAllReqCounts().subscribe({
      next: (res: any) => {
        if(res.responseData){
          this.PTOreqCount = res.responseData.ptoPendingCount;
          this.timesheetReqCount = res.responseData.timeSheetPendingCount;
          this.timeOffCount = res.responseData.timeOffCount
        }
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  onTableDataChange(event: any): void {
    this.page = event;
    this.fetchLeave();
  }
  onptoTableDataChange(event: any): void {
    this.page = event;
    this.fetchPtoReqs();
    
  }
  onptotimesheetTableDataChange(event: any): void {
    this.page = event;
    this.fetchTimesheetPtoReqs();
    
  }
  updatePtoStatus(id: string, status: string): void {
    this.ptoReqService.updatePtoReqStatus(id, { status }).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success!', res.responseData);
        this.router.navigate(['/leave']);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  updateTimesheetStatus(id: string, status: string): void {
    this.editTimesheetReqService.updateTimesheetReqStatus(id, { status }).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success!', res.responseData);
        this.router.navigate(['/leave']);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  leaveStatusUpdate(id: string, status: string): void {
    console.log({ id, status });
    if (status === 'Cancelled') {
      status = "Denied";
      this.updateForm.patchValue({ status, id });
      this.formModal.show();
    } else {
      this.updateStatus(id, { status });
    }
  }

  updateStatus(id: string, data: any): void {
    this.leaveService.updateLeaveStatus(id, data).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success!', res.responseData);
        this.reloadWindow();
        this.router.navigate(['/leave']);
      },
      error: (err: any) => {
        this.reloadWindow();
        this.errorHandelService.handleError(err);
      }
    });
  }

  reloadWindow(): void {
    window.location.reload();
  }

  getUsersDropdown(): void {
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
    this.fetchLeave();
    this.fetchPtoReqs();
    this.fetchTimesheetPtoReqs();
  }

  noUpdate(): void {
    this.formModal.hide();
    this.reloadWindow();
  }

  onUpdate(): void {
    if (this.updateForm.valid) {
      const id = this.updateForm.value.id;
      delete this.updateForm.value.id;
      this.updateForm.value.status = "Cancelled";
      this.updateStatus(id, this.updateForm.value);
      this.updateForm.reset();
      this.formModal.hide();
    }
  }

  navigateToEdit(itemId: string, user: string): void {
    this.router.navigate(['leave/edit', itemId], {
      queryParams: { id: user }
    });
  }

  ngAfterViewInit(): void {
    initMDB({ Tab });
  }
}
