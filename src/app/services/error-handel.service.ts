import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandelService {
  constructor(
    private authService : AuthService,
    private toastrService: ToastrService,
  ) {}

  handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.logout();
    } 
    this.toastrService.error('Message Error!', error?.error?.responseData);
  }
}

