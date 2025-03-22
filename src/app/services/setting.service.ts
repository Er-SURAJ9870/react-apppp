import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class SettingService {
  serverUrl = environment.baseUrl;
  apiKey = environment.apiKey;
  sessionData: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getSetting(): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/settings/admin-setting`, { headers })
  }

  public getWorkHrsSetting(id: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/settings/user-setting/${id}`, { headers })
  }

  public settingUpdate(data : any): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/settings/admin-setting`, data, { headers })
  }

  public updateBreakTime(data : any): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/settings/admin-break-setting`, data, { headers })
  }

  public updateGeoLocation(data : any): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/settings/admin-geo-location`, data, { headers })
  }

  public updateWorkingHrs(data : any, id: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/settings/admin-working-hrs/${id}`, data, { headers })
  }

  public updateExceptionalWorkHrs(data : any): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/settings/admin/exceptional-work-hr`, data, { headers })
  }


  public getEceptionalWorkHrs( id: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/settings/admin/exceptional-work-hr/${id}`, { headers })
  }
}


