import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  serverUrl = environment.baseUrl;
  apiKey = environment.apiKey;
  sessionData: any;
  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) { }


  public accountLogin(email: string, password: string) {
    const headers = new HttpHeaders({
      'api-key': this.apiKey
    });

    return this.http.post(`${this.serverUrl}api/users/admin-login`, { email, password }, { headers })
  }

  public isLoggedIn() {
    const tokenData = this.getSession()
    if (tokenData) {
      if (tokenData["role"] === "ADMIN" || tokenData["role"] === "SUB_ADMIN") {
        return true;
      }
    }
    return false;
  }

  public logout() {
    localStorage.removeItem('session-info');
  }

  public setSession(data: any): any {
    data = this.utilService.encrypt(JSON.stringify(data))
    localStorage.setItem('session-info', data);
    return true;
  }

  public getSession(): any {
    let sessionInfo = localStorage.getItem('session-info');
    if (sessionInfo) {
      return JSON.parse(this.utilService.decrypt(sessionInfo))
    } else {
      return null
    }
  }

  public setPayCycle(data: any): any {
    data = this.utilService.encrypt(JSON.stringify(data))
    localStorage.setItem('pay-cycles', data);
    return true;
  }

  public getPayCycle(): any {
    let sessionInfo = localStorage.getItem('pay-cycles');
    if (sessionInfo) {
      return JSON.parse(this.utilService.decrypt(sessionInfo))
    } else {
      return null
    }
  }

  public setEncryptedData(data: any, type: string): any {
    data = this.utilService.encrypt(JSON.stringify(data))
    localStorage.setItem(type, data);
    return true;
  }

  public getEncryptedData(type: string): any {
    let sessionInfo = localStorage.getItem(type);
    if (sessionInfo) {
      return JSON.parse(this.utilService.decrypt(sessionInfo))
    } else {
      return null
    }
  }

  // public setWorkHrs(data: any): any {
  //   data = this.utilService.encrypt(JSON.stringify(data))
  //   localStorage.setItem('wrok-hrs-info', data);
  //   return true;
  // }

  // public getWorkHrs(): any {
  //   let sessionInfo = localStorage.getItem('wrok-hrs-info');
  //   if (sessionInfo) {
  //     return JSON.parse(this.utilService.decrypt(sessionInfo))
  //   } else {
  //     return null
  //   }
  // }

  public setNotificationCache(data: any): any {
    data = this.utilService.encrypt(JSON.stringify(data))
    localStorage.setItem('notification-info', data);
    return true;
  }

  public getNotificationCache(): any {
    let sessionInfo = localStorage.getItem('notification-info');
    if (sessionInfo) {
      return JSON.parse(this.utilService.decrypt(sessionInfo))
    } else {
      return null
    }
  }

  public fileUpload(file: any) {
    this.sessionData = this.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.post(`${this.serverUrl}api/users/file-upload`, file, { headers })
  }

  public getAccountDetail(): Observable<any> {
    this.sessionData = this.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/users/profile-detail`, { headers })
  }

  public changePassword(data: any): Observable<any> {
    this.sessionData = this.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.post(`${this.serverUrl}api/users/change-password`, data, { headers })
  }

  public updateProfile(data: any): Observable<any> {
    this.sessionData = this.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/users/profile-update`, data, { headers })
  }

  public updateProfileSetting(data: any): Observable<any> {
    this.sessionData = this.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/users/admin-notification-setting`, data, { headers })
  }



  public checkIn(file: any): Observable<any> {
    this.sessionData = this.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });
    console.log("data", file)
    return this.http.post(`${this.serverUrl}api/users/admin/check-in`, file, { headers })
  }
}
