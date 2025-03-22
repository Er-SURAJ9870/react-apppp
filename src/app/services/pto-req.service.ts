import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class PtoReqService {
  getPtoReqs(ptoPage: number, ptoItemsPerPage: number, value: any) {
    throw new Error('Method not implemented.');
  }
  serverUrl = environment.baseUrl;
  apiKey = environment.apiKey;

  sessionData: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getEditPTOReqs(page: number, itemsPerPage: number, user?: string, status = "") {
    console.log("UNREAD...............", status)
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin/edit/pto-req`, { headers })
  }

  public updatePtoReqStatus(id: string, payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/employee-attendances/admin/edit/pto-req/status-update/${id}`, payload, { headers })
  }

  public getAllReqCounts() {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin/pending-count/request`, { headers })
  }
}













