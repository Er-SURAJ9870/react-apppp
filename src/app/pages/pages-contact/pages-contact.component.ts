import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../services/setting.service';
import { ErrorHandelService } from '../../services/error-handel.service'

@Component({
  selector: 'app-pages-contact',
  templateUrl: './pages-contact.component.html',
  styleUrls: ['./pages-contact.component.css']
})
export class PagesContactComponent implements OnInit {
  setting!: any;
  constructor(
    private settingService: SettingService,
    private errorHandelService: ErrorHandelService
  ) { }

  ngOnInit(): void {
    this.getProductDetails()
  }

  getProductDetails(): any {
    // this.settingService.getSetting().subscribe({
    //   next: (res: any) => {
    //     this.setting = res.responseData;
    //     console.log("this.setting", this.setting)
    //   },
    //   error: (err: any) => {
    //     this.errorHandelService.handleError(err);
    //   }
    // });
  }
}


