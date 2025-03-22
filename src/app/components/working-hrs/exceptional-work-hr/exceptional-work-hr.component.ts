import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandelService } from 'src/app/services/error-handel.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { UtilService } from 'src/app/services/util.service';
declare var window: any;

@Component({
  selector: 'app-exceptional-work-hr',
  templateUrl: './exceptional-work-hr.component.html',
  styleUrls: ['./exceptional-work-hr.component.css']
})
export class ExceptionalWorkHrComponent implements OnInit {
  data : any[] = [];
  formModal: any;
  userId !: string;
  title = "Custom Hours";
  constructor(
    private settingService: SettingService,
    private spinner: NgxSpinnerService,
    private errorHandelService : ErrorHandelService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService
  ) {
    this.userId = this.route.snapshot.params['userId'];
    console.log(" user id...........", this.userId)
  }

  ngOnInit(): any {
    this.fetchExceptionalWorkHr()

  }
  

  fetchExceptionalWorkHr(): any {
    this.spinner.show();
    this.settingService.getEceptionalWorkHrs(this.userId).subscribe({
      next: (res: any) => { 
        console.log()
        this.data = res.responseData.exceptionalWorkHr;
        this.spinner.hide(); 
      },
      error: (err: any) => { 
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  openModal(id: string) {
    this.userId = id;
    this.formModal.show()
  }

  getEditLink(item: any): void {
    this.router.navigate(['/exceptional/work-hrs/edit'], { queryParams: { data: this.utilService.encrypt(JSON.stringify(item)) , userId: this.userId}});
  }

}


