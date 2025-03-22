import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  serverUrl = environment.baseUrl;
  apiKey = environment.apiKey;

  sessionData: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getNotifications(page: number, itemsPerPage: number, type?:string) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/notifications/admin?page=${page}&limit=${itemsPerPage}&type=${type}`, { headers })
  }

  

  public addNotification( payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.post(`${this.serverUrl}api/notifications/admin`, payload, { headers })
  }

  public updateNotificationStatus(id: string, payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/notifications/admin/status-update/?type=${id}`, payload, { headers })
  }

  public getotification(id: string) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/notifications/admin/${id}`, { headers })
  }

  public deleteNotification(id: string) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.delete(`${this.serverUrl}api/notifications/admin/${id}`, { headers })
  }


}




