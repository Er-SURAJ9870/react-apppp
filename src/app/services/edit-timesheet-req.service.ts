import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class EditTimesheetReqService {
  serverUrl = environment.baseUrl;
  apiKey = environment.apiKey;

  sessionData: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getEditTimsheetReqs(page: number, itemsPerPage: number, user?: string, status = "") {
    console.log("UNREAD...............", status)
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin/edit/timesheet-req`, { headers })
  }

  // public addPtoReq(payload: any) {
  //   this.sessionData = this.authService.getSession();
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.sessionData.token}`,
  //     'api-key': this.apiKey
  //   });

  //   return this.http.post(`${this.serverUrl}api/pto-req/admin`, payload, { headers })
  // }

  public updateTimesheetReqStatus(id: string, payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/employee-attendances/admin/edit/timesheet-req/status-update/${id}`, payload, { headers })
  }
}






