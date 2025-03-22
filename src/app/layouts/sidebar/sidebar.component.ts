import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { ErrorHandelService } from '../../services/error-handel.service';
import { PtoReqService } from 'src/app/services/pto-req.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  url = "";
  timeOffCount = 0;
  PTOreqCount = 0;
  timesheetReqCount = 0;
  requestCount=0;

  constructor(
    private router: Router,
    private ptoReqService: PtoReqService,
    private errorHandelService: ErrorHandelService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("SIDEBAR..................", event.url)
        if( event.url === "/") {
          this.url = "/dashboard";
        }else{
          if(event.url.split('/').length > 2){
            this.url = "/"+event.url.split('/')[1]
          }else {
            this.url = event.url
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.getAllReqCounts()
  }

  getAllReqCounts(): any {
    this.ptoReqService.getAllReqCounts().subscribe({
      next: (res: any) => {
        if(res.responseData){
          this.PTOreqCount = res.responseData.ptoPendingCount;
          this.timesheetReqCount = res.responseData.timeSheetPendingCount;
          this.timeOffCount = res.responseData.timeOffCount
          this.requestCount=this.PTOreqCount + this.timesheetReqCount + this.timeOffCount
        }
      },
      error: (err: any) => {
        this.errorHandelService.handleError(err);
      }
    });
  }
}
