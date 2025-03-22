import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  serverUrl = environment.baseUrl;
  apiKey = environment.apiKey;
  sessionData: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getUsers(page: number, itemsPerPage: number, searchKey?: string, empType?:string): Observable<any> {
    console.log("iiiiiiiiiiiiiiiii", empType)
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/users/admin/user-list?page=${page}&limit=${itemsPerPage}&search=${searchKey}&employeeType=${empType}`, { headers })
  }

  public getUser(id: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/users/admin/user-detail/${id}`, { headers })
  }

  public addAccount(payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.post(`${this.serverUrl}api/users/admin/add-account/`, payload, { headers })
  }

  public updateAccount(id: string, payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/users/admin/update-account/${id}`, payload, { headers })
  }
  public updatePayRate(id: string, payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/users/admin/update/pay-rate/${id}`, payload, { headers })
  }

  

  public updateAllowException(id: string, payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/users/admin/allow-exception/${id}`, payload, { headers })
  }
  
  public deleteBanner(id: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.delete(`${this.serverUrl}api/users/${id}`, { headers })
  }

  async getExcelExportsUsers(empType?:string): Promise<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    try {
      const response = await this.http.get(`${this.serverUrl}api/users/admin/user-list/export?employeeType=${empType}`, { headers }).toPromise();
      return response;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  public getUsersDropdown(): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/users/admin/drop-down`, { headers })
  }
  
}

