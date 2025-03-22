import { ActivatedRoute } from '@angular/router';
import { ErrorHandelService } from '../../../services/error-handel.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  total?: number;
  profile: any;
  notifications: any;
  id: any;
  page: number = 1;
  count: number = 0;
  itemsPerPage: number = 10;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private errorHandelService: ErrorHandelService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.total = 100
    this.profile = this.authService.getSession();
    this.id = this.route.snapshot.params['id'];
    this.fetchNotifications()
  }

  fetchNotifications(): any {
    this.spinner.show();
    this.notificationService.getNotifications(this.page, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.notifications = res.responseData.data;
        this.total = res.responseData.total
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }



  updateStatus(id: string, status: boolean): void {
    this.notificationService.updateNotificationStatus(id, { status }).subscribe({
      next: (res: any) => {
        this.toastrService.success('Success !', res.responseData);
        this.router.navigate(['/notification']);
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.fetchNotifications();
  }
}




