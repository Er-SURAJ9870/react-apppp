import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandelService } from '../../services/error-handel.service';
import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  total?: number;
  profile: any;
  notifications: any;
  id: any;
  page: number = 1;
  limit: number = 1000;
  status: string = "UNREAD"
  name: string = ""
  role: string = ""
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private errorHandelService: ErrorHandelService
  ) { }

  ngOnInit(): void {
    this.total = 100
    this.profile = this.authService.getSession();
    this.id = this.route.snapshot.params['id'];
    this.fetchNotifications()
    this.name = this.profile.name
    this.role = this.profile.role ? this.toTitleCase(this.profile.role): ""
  }

  sidebarToggle() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }

  logout(): void {
    this.authService.logout()
  }

  toTitleCase(str: string) : string {
    return str.toLowerCase().replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
  }

  fetchNotifications(): any {
    this.notificationService.getNotifications(this.page, this.limit, this.status).subscribe({
      next: (res: any) => {
        this.notifications = res.responseData.data;
        this.total = res.responseData.total
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  navigateToNotifications() {
    this.router.navigate(['/notification']); 
  }

  readNotification(id: string, status: boolean): void {
    this.notificationService.updateNotificationStatus(id, { status }).subscribe({
      next: (res: any) => {
        this.notifications = this.notifications.filter((item: any) => item._id !== id);
        this.total = this.notifications.length
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }

  markAsRead(notification: any) {
    // if (notification.status) {
    //   notification.status = false; 
    //   this.readNotification(notification._id, notification.status)
    // }
  }
}




// "bi bi-exclamation-circle text-warning">
// "bi bi-x-circle text-danger"
// "bi bi-check-circle text-success"
// "bi bi-info-circle text-primary"

