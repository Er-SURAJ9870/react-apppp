import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class LeaveService {
  serverUrl = environment.baseUrl;
  apiKey = environment.apiKey;

  sessionData: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getLeaves(page: number, itemsPerPage: number, user?: string, status = "") {
    console.log("UNREAD...............", status)
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/leaves/admin?page=${page}&limit=${itemsPerPage}&user=${user}&status=${status}`, { headers })
  }

  public getLeave(id: string) {
    console.log("UNREAD...............", status)
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/leaves/admin/${id}`, { headers })
  }



  public addLeave(payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.post(`${this.serverUrl}api/leaves/admin`, payload, { headers })
  }

  // public updateLeave(id: string, payload: any) {
  //   this.sessionData = this.authService.getSession();
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.sessionData.token}`,
  //     'api-key': this.apiKey
  //   });
  //   return this.http.put(`${this.serverUrl}api/leaves/admin/update/${id}`, payload, { headers })
  // }

  public updateLeaveStatus(id: string, payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });
    return this.http.put(`${this.serverUrl}api/leaves/admin/status-update/${id}`, payload, { headers })
  }

  public deleteLeave(id: string) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.delete(`${this.serverUrl}api/leaves/admin/${id}`, { headers })
  }

  public getBalanceLeave(id: string) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });
    return this.http.get(`${this.serverUrl}api/leaves/admin/${id}/total-balance`, { headers })
  }

  public getLeavePendingCount() {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });
    return this.http.get(`${this.serverUrl}api/leaves/admin/pending/count`, { headers })
  }

}




