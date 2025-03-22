import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  serverUrl = environment.baseUrl;
  apiKey = environment.apiKey;
  sessionData: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  public getEmployees(page: number, itemsPerPage: number, searchKey?: string, fromDate?: Date, toDate?: Date, payCycle?: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin?page=${page}&limit=${itemsPerPage}&search=${searchKey}&fromDate=${fromDate}&toDate=${toDate}&payCycle=${payCycle}`, { headers })
  }

  async getExcelExportEmployeesById(id: string, fromDate?: string, toDate?: string, payCycle?: string): Promise<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    try {
      const response = await this.http.get(`${this.serverUrl}api/employee-attendances/admin/${id}?fromDate=${fromDate}&toDate=${toDate}&payCycle=${payCycle}`, { headers }).toPromise();
      return response;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  async getExcelExportEmployees(page: number, itemsPerPage: number, searchKey?: string, fromDate?: Date, toDate?: Date, payCycle?: string): Promise<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    try {
      const response = await this.http.get(`${this.serverUrl}api/employee-attendances/admin?page=${page}&limit=${itemsPerPage}&search=${searchKey}&fromDate=${fromDate}&toDate=${toDate}&payCycle=${payCycle}`, { headers }).toPromise();
      return response;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  public getEmployeesDailyReport( fromDate?: Date): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin/daily/report?fromDate=${fromDate}`, { headers })
  }

  public getEmployee(id: string, fromDate?: string, toDate?: string, payCycle?: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin/${id}?fromDate=${fromDate}&toDate=${toDate}&payCycle=${payCycle}`, { headers })
  }

  public addWorkTime(payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.post(`${this.serverUrl}api/employee-attendances/admin`, payload, { headers })
  }

  public updateWorkTime(id: string, payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/employee-attendances/admin/update/${id}`, payload, { headers })
  }

  public adjustPTO(payload: any) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.put(`${this.serverUrl}api/employee-attendances/admin/adjust/pto`, payload, { headers })
  }

  
  public deleteWorkTime(id: string) {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.delete(`${this.serverUrl}api/employee-attendances/admin/reset/${id}`, { headers })
  }

  public getWorkTime(id: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin/details/${id}`, { headers })
  }
  
  public dashboard(filter?: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin-dashboard?filter=${filter}`, { headers })
  }

  public dashboardTabViews(filter?: string): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/admin-dashboard/tab-view?type=${filter}`, { headers })
  }

  public getPayCycle(): Observable<any> {
    this.sessionData = this.authService.getSession();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionData.token}`,
      'api-key': this.apiKey
    });

    return this.http.get(`${this.serverUrl}api/employee-attendances/pay-cycle`, { headers })
  }
}

