import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/user.model';
import { ErrorHandelService } from 'src/app/services/error-handel.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/services/excel.service';
import { ActivatedRoute } from '@angular/router';
import { Tab, initMDB } from 'mdb-ui-kit';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  user: User[];
  page: number = 1;
  count: number = 0;
  itemsPerPage: number = 20;
  searchTerm = "";
  formModal: any;
  id !: string;
  path: string = "user";
  dynamicValue = 25;
  isProgress = false;
  title = "Employees";
  empType: any = ""
  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private errorHandelService: ErrorHandelService,
    private toastrService: ToastrService,
    private excelService: ExcelService,
    private route: ActivatedRoute
  ) {
    this.user = [];
    this.route.url.subscribe(segments => {
      this.path = segments.map(segment => segment.path).join('/');
      console.log('Current Path:', this.path);
    });
  }

  ngOnInit(): any {
    this.fetchUsers(this.page, this.itemsPerPage, this.searchTerm)
  }

  onTabChange(type?: string) {
    this.empType = type
    this.fetchUsers(this.page, this.itemsPerPage, this.searchTerm)
  }

  fetchUsers(page: number, itemsPerPage: number, searchKey?: string): any {
    this.spinner.show();
    this.userService.getUsers(page, itemsPerPage, searchKey, this.empType).subscribe({
      next: (res: any) => {
        this.user = res.responseData.data;
        this.count = res.responseData.total;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.fetchUsers(this.page, this.itemsPerPage, this.searchTerm);
  }

  onSearch() {
    this.fetchUsers(this.page, this.itemsPerPage, this.searchTerm);
  }

  openModal(id: string) {
    this.id = id;
    this.formModal.show()
  }

  updateAllowExceptionType(id: string, status: boolean) {
    this.spinner.show();
    this.userService.updateAllowException(id, { allowExceptionType: status }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastrService.success('Success !', res.responseData);
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandelService.handleError(err);
      }
    });
  }

  async generateExcel() {
    console.log("Called excel sheet...........")
    let type = "ActiveEmployees"
    let title = "Active Employees"
    this.isProgress = true;
    if (this.empType === "Inactive") {
      type = "InactiveEmployees";
      title = "Inactive Employees"
    }
    const res = await this.userService.getExcelExportsUsers(this.empType);
    if (res && res.responseData.data) {
      // let todayAfter24Hr = new Date();
      // todayAfter24Hr.setHours(0, 0, 0, 0)

      // let activeEmp = res.responseData.data.filter((d: any) => new Date(d.lastDate) >=  todayAfter24Hr);
      // let exEmp = res.responseData.data.filter((d: any) => new Date(d.lastDate) < todayAfter24Hr);
      this.excelService.generateUserExcel(res.responseData.data, title);
      this.isProgress = false;
    } else {
      this.isProgress = false;
      this.toastrService.error('Message Error!', "Invalid Data.");
    }
  }

  ngAfterViewInit(): void {
    initMDB({ Tab });
  }
}

