import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandelService } from '../../../services/error-handel.service'
import { NotificationService } from '../../../services/notification.service'
import { NgxSpinnerService } from 'ngx-spinner';
declare var window: any;

@Component({
  selector: 'app-notification-add-edit',
  templateUrl: './notification-add-edit.component.html',
  styleUrls: ['./notification-add-edit.component.css']
})
export class NotificationAddEditComponent implements OnInit {
  formModal: any;
  deleteFormModal: any;

  today = new Date();
  addForm!: FormGroup;
  title : string = "New Communication";
  id?: string
  formTitle : string = "Create new communication"
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private errorHandelService: ErrorHandelService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,

  ) { }

  async ngOnInit() {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('cancelModal')
    )

    this.deleteFormModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    )
    this.id = this.route.snapshot.params['id'];

    this.addForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });

    if (this.id) {
      this.title = 'Edit Communication';
      this.formTitle = 'Edit communication'
      this.notificationService.getotification(this.id).subscribe({
        next: (res: any) => {
          this.addForm.patchValue(res.responseData);
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

  onSubmit(): void {
    console.log("this.addForm.value", this.addForm.value)
    if (this.addForm.invalid) {
      this.toastrService.error('Message Error!', "Invalid Data.");
      return;
    }

    if (this.id) {
      this.notificationService.updateNotificationStatus(this.id, this.addForm.value).subscribe({
        next: (res: any) => {
          console.log("res....................", res)
          this.toastrService.success('Success !', res.responseData);
          this.router.navigate(['/notification']);
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    } else {
      this.notificationService.addNotification(this.addForm.value).subscribe({
        next: (res: any) => {
          this.toastrService.success('Success !', res.responseData);
          this.router.navigate(['/notification']);
        },
        error: (err: any) => {
          this.errorHandelService.handleError(err);
        }
      });
    }
  }

  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: (res: any) => {
        this.router.navigate(['/notification']);
      },
      error: (err: any) => {
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

  onCancel() {
    this.router.navigate(['/notification']);
  }

  // ---------------------------------------------------------------------

  // On delete
  onDeleteEvent(event: Event) {
    event.preventDefault();
    this.deleteFormModal.show()
  }

  noDelete() {
    this.deleteFormModal.hide()
  }

  onDelete() {
    if (this.id) {
      this.deleteNotification(this.id)
    }
  }
}
