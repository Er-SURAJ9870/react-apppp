import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { ErrorHandelService } from '../../../services/error-handel.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css']
})
export class HolidayComponent implements OnInit {
  total?: number;
  profile: any;
  notifications: any;
  id: any;
  page: number = 1;
  count: number = 0;
  itemsPerPage: number = 10;

  @ViewChild('deleteModal') deleteModal!: ElementRef;

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
    this.total = 100;
    this.profile = this.authService.getSession();
    this.id = this.route.snapshot.params['id'];
    this.fetchNotifications();
  }

  fetchNotifications(): any {
    this.spinner.show();
    this.notificationService.getNotifications(this.page, this.itemsPerPage, "HOLIDAY").subscribe({
      next: (res: any) => {
        this.notifications = res.responseData.data;
        this.total = res.responseData.total;
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

  openModal(event: Event) {
    event.preventDefault();  // Prevent default action of the anchor tag
    const modalElement = this.deleteModal.nativeElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  closeModal() {
    const modalElement = this.deleteModal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  confirmDelete() {
    this.closeModal();
    // Implement your deletion logic here
    console.log('Delete confirmed');
    this.router.navigate(['/holiday/add']); // Navigate after confirmation
  }
}
