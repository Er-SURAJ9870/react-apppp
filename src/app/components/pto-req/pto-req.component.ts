import { ActivatedRoute } from '@angular/router';
import { ErrorHandelService } from '../../services/error-handel.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import { PtoReqService } from '../../services/pto-req.service';

@Component({
  selector: 'app-pto-req',
  templateUrl: './pto-req.component.html',
  styleUrls: ['./pto-req.component.css']
})
export class PtoReqComponent implements OnInit {
  profile: any;
  ptoReqs: any;
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
    private editPtoReqService: PtoReqService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userDropDownForm = new FormControl('');
    this.profile = this.authService.getSession();
    this.id = this.route.snapshot.params['id'];
    this.getUsersDropdown()
    this.fetchPtoReqs()
  }

  fetchPtoReqs(): any {
    this.spinner.show();
    this.editPtoReqService.getEditPTOReqs(this.page, this.itemsPerPage, this.userDropDownForm.value).subscribe({
      next: (res: any) => {
        this.ptoReqs = res.responseData;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.fetchPtoReqs();
  }

  statusUpdate(id: string, status: string) {
    this.editPtoReqService.updatePtoReqStatus(id, { status }).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);
        this.router.navigate(['/pto-req']);
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
    this.fetchPtoReqs()
  }
  
}

