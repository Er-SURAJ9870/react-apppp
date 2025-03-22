import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  workbook: any;
  constructor() {
  }

  isWeekend(dateString: string) {
    const date = new Date(dateString);
    return date.getDay() === 0 || date.getDay() === 6; // Sunday is 0, Saturday is 6
  }

  getFullName(user: any) {
    const { firstName, middleName, lastName } = user;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  }

  formatDate(dateString: string) {
    const options : any = { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  formatDateInMMDDYYYY(date? : any) {
    const options : any = { month: 'numeric', day: 'numeric', year: 'numeric' };
    date = date ? new Date(date) : new Date()
    return date.toLocaleDateString('en-US', options);
  }

  generateUserExcel(activeData: any, type: string) {
    const fileName = type

    this.workbook = new Workbook();
    let worksheet = this.workbook.addWorksheet('Details');
    // Add title 
    let title = ` Date: ${this.formatDateInMMDDYYYY()}                                                        ${type}`
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {name: 'Comic Sans MS', family: 4, size: 12, bold: true };
    titleRow.alignment = { horizontal: 'left' }; 
    titleRow.height = 24; 

    worksheet.mergeCells(`A1:S1`);

    const header = [
      "SN", 
      "Name",
      "Employee Type", 
      "Position", 
      "Hire Date", 
      "Phone", 
      "Email", 
      "Social Security", 
      "DoB", 
      "Pay Type", 
      "Salary", 
      "Address1", 
      "Address2", 
      "City", 
      "State", 
      "Zip code", 
      "Termination Date", 
      "Emergency Contact Name", 
      "Emergency Contact Phone"
    ]
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(header);
    worksheet.getColumn(1).width = 6;
    worksheet.getColumn(2).width = 20; 
    worksheet.getColumn(3).width = 15; 
    worksheet.getColumn(4).width = 30; 
    worksheet.getColumn(5).width = 12; 
    worksheet.getColumn(6).width = 13; 
    worksheet.getColumn(7).width = 28; 
    worksheet.getColumn(8).width = 15; 
    worksheet.getColumn(9).width = 12; 
    worksheet.getColumn(10).width = 12; 
    worksheet.getColumn(11).width = 10; 
    worksheet.getColumn(12).width = 20; 
    worksheet.getColumn(13).width = 20; 
    worksheet.getColumn(14).width = 12; 
    worksheet.getColumn(15).width = 12; 
    worksheet.getColumn(16).width = 12; 
    worksheet.getColumn(17).width = 18; 
    worksheet.getColumn(18).width = 24; 
    worksheet.getColumn(19).width = 24; 

    headerRow.eachCell((cell: any) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' } // Red color
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true };
    });
    headerRow.height = 20;

    activeData.forEach((d: any, index: number) => {
      let fullName = d.firstName;
      if(d.middleName) fullName = `${fullName} ${d.middleName}`;
      if(d.lastName) fullName = `${fullName} ${d.lastName}`

      let formattedPhoneNumber = d.mobileNumber ? d.mobileNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3') : ""

      let dob = new Date(d.dob);
      let formattedDobDate = dob
      // dob.toLocaleDateString('en-US', {
      //   month: '2-digit',
      //   day: '2-digit',
      //   year: 'numeric'
      // });

      let startDate = new Date(d.startDate);
      let formattedStartDate = startDate
      // startDate.toLocaleDateString('en-US', {
      //   month: '2-digit',
      //   day: '2-digit',
      //   year: 'numeric'
      // });
      let formattedLastDate
      if(d.lastDate){
        let lastDate= new Date(d.lastDate);
        formattedLastDate =lastDate
        //  lastDate.toLocaleDateString('en-US', {
        //   month: '2-digit',
        //   day: '2-digit',
        //   year: 'numeric'
        // });
      }

      let formattedEmergencyContactPhone = d.emergencyContactPhone ? d.emergencyContactPhone.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3') : "";
      let formattedSocialSecurity = d.socialSecurity ? d.socialSecurity.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3') : "";

      const dataRow = worksheet.addRow([
        index+1,
        fullName, 
        d.employeeType, 
        d.title, 
        formattedStartDate, 
        formattedPhoneNumber, 
        d.email, 
        formattedSocialSecurity, 
        formattedDobDate,
        d.payType , 
        `$${d.payRate}/hr.`, 
        d.address.address1,
        d.address.address2 ? d.address.address2 : '-', 
        d.address.city, 
        d.address.state, 
        d.address.zipcode, 
        formattedLastDate ? formattedLastDate: '-', 
        d.emergencyContactName? d.emergencyContactName: '-', 
        formattedEmergencyContactPhone ? formattedEmergencyContactPhone: '-'
      ]);
      // Apply border and text wrapping to each cell in the data row
      dataRow.eachCell((cell: any, colNumber: number) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        
        if (colNumber === 2 || colNumber === 7 || colNumber === 12 || colNumber === 13) { // B, G, L M columns
          cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
        } else {
          cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        }
        // Set date format for column E
        if (colNumber === 5 || colNumber === 9 || colNumber === 17) { // E column
          cell.numFmt = 'mm/dd/yyyy;@';
        }
      });
    });

    this.workbook.xlsx.writeBuffer().then(async (data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${fileName}.xlsx`)
      console.log("File saves successfully")
    });
    delete this.workbook;
  }

  timeSheetExcelExport(data: any, payCycle: string) {
    const fileName = `Reports_${payCycle}`

    this.workbook = new Workbook();
    let worksheet = this.workbook.addWorksheet('Details');
    // Add title 
    let title = `Payroll Summary: ${payCycle}`
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {name: 'Comic Sans MS', family: 4, size: 12, underline: 'single', bold: true };
    titleRow.alignment = { horizontal: 'center' }; // Center align the title
    titleRow.height = 25; // Increase the height of the title row
    worksheet.mergeCells(`A1:J1`); // Merge cells from A1 to N1 for the title

    // Add main header
    worksheet.addRow([]);
    
    const header = ["SN", "Emp. Name", "Work hrs", "Paid Hrs.", "Paid Hrs.(In decimal)" , "Gross Pay", "Time-off", "PTO available", "Used PTO", "PTO remaining"];
    worksheet.getColumn(1).width = 6;
    worksheet.getColumn(2).width = 20; 
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20; 
    worksheet.getColumn(5).width = 20; 
    worksheet.getColumn(6).width = 16; 
    worksheet.getColumn(7).width = 16; 
    worksheet.getColumn(8).width = 16; 
    worksheet.getColumn(9).width = 16; 
    worksheet.getColumn(10).width = 16; 

    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell: any) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' } // Red color
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true };
    });
    headerRow.height = 20;
  
  
  
    data.forEach((d: any, index: number) => {
      let dataRow = worksheet.addRow([         
        index+1,
        d.name,
        d.workHrs, 
        d.netHrs,
        Number(d.netHrsInDecimal), 
        Number(d.grossPay.replace(/,/g, '')),
        d.timeoff, 
        Number(d.PTOInDecimal), 
        // d.PTO, 
        Number(d.leaveUsedInDecimal), 
        Number(d.leaveRemainingInDecimal)
      ]);

      
      // Apply border and text wrapping to each cell in the data row
      dataRow.eachCell((cell: any, colNumber: number) => {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        if (colNumber === 2) { 
          cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
        } else {
          cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        }
        // Apply currency format to the grossPay column (column 5)
        if (colNumber === 6) {
          cell.numFmt = '$#,##0.00'; // Accounting format
        }
        if (colNumber === 5 || colNumber === 8 || colNumber === 9 || colNumber === 10) {
          cell.numFmt = '0.00'; // Two decimal places formate
        }
      });
    });
    // Calculate sum of columns D (netHrsInDecimal) and E (grossPay)
    let lastRow = worksheet.lastRow;

    // Sum for column D
    let sumCellD = worksheet.getCell(`E${lastRow.number + 1}`);
    sumCellD.value = { formula: `SUM(E2:E${lastRow.number})` };
    sumCellD.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'double' },
      right: { style: 'thin' }
    };
    sumCellD.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    sumCellD.numFmt = '0.00'; // 2 decimal places format
    sumCellD.font = { bold: true };

    // Sum for column E
    let sumCellE = worksheet.getCell(`F${lastRow.number + 1}`);
    sumCellE.value = { formula: `SUM(F2:F${lastRow.number})` };
    sumCellE.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'double' },
      right: { style: 'thin' }
    };
    sumCellE.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    sumCellE.numFmt = '$#,##0.00'; // Accounting format
    // Make the sum value bold
    sumCellE.font = { bold: true };
    
    
    this.workbook.xlsx.writeBuffer().then(async (data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${fileName}.xlsx`);
      console.log("File saved successfully");
    });
    delete this.workbook;
  }
  timeSheetExcelExportByUser(data: any, payCycle: string) {
    // Initialize workbook and worksheet
    this.workbook = new Workbook();
    let worksheet = this.workbook.addWorksheet('Details');

    // Add title 
    let title = `ALPINE GROWS - TIMESHEET (${payCycle})`
    let name = this.getFullName(data.user)
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {name: 'Comic Sans MS', family: 4, size: 12, underline: 'single', bold: true };
    titleRow.alignment = { horizontal: 'center' }; // Center align the title
    titleRow.height = 25; // Increase the height of the title row
    worksheet.mergeCells(`A1:N1`); // Merge cells from A1 to N1 for the title

    // Add Name row
    let nameRow = worksheet.addRow([`Name:\t\t   ${name}`]);
    nameRow.font = { name: 'Arial', size: 11, bold: true };
    nameRow.alignment = { horizontal: 'left' }; // Align left
    worksheet.mergeCells(`A2:N2`); // Merge cells from A2 to N2
    nameRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        if (colNumber <= 14) { // Ensuring it applies only to columns A to N
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2F0D9' } // Light grey background color
            };
        }
    });
    // --------------------------------------------------------

    // Add Payrate row
    let payrateRow = worksheet.addRow([`Pay Rate:\t\t   $ ${data.user.payRate}`]);
    payrateRow.font = { name: 'Arial', size: 11, bold: true };
    payrateRow.alignment = { horizontal: 'left' }; // Align left
    worksheet.mergeCells(`A3:N3`); // Merge cells from A3 to N3
    payrateRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        if (colNumber <= 14) { // Ensuring it applies only to columns A to N
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2F0D9' } // Light grey background color
            };
        }
    });
    // -----------------------------------------------------------
    // Add summry dat
    let descriptionRow = worksheet.addRow([]);
    // Merge cells and set values
    worksheet.mergeCells('A4:B4'); // Merge cells for Time-off
    descriptionRow.getCell(3).value = `Time-off: ${data.totalSum?.timeoff}`;

    worksheet.mergeCells('C4:D4'); // Merge cells for Regular hrs
    descriptionRow.getCell(5).value = `Regular hrs: ${data.totalSum?.regularHrs}`;

    worksheet.mergeCells('E4:F4'); // Merge cells for Gross Pay
    descriptionRow.getCell(7).value = `Gross Pay: $ ${data.totalSum?.grossPay}`;

    worksheet.mergeCells('G4:H4'); // Merge cells for Bank Hrs
    descriptionRow.getCell(9).value = `Bank Hrs: ${data.totalSum?.overTime}`;

    worksheet.mergeCells('I4:J4'); // Merge cells for Work hrs
    descriptionRow.getCell(11).value = `Work hrs: ${data.totalSum?.netHours}`;

    // Set font to bold and center align the title
    descriptionRow.font = { bold: true };
    descriptionRow.alignment = { horizontal: 'center' };
    // Add border to the cell and set background color
    descriptionRow.eachCell((cell: any) => {
      cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
      };
    });
    // ---------------------------------------------------


    // Main table data
    const header = [
      "SN", "Date", "Clock-in", "Shift Start", "Break-1",
      "Lunch Break", "Break-2", "Add. Break", "Clock-out", "Shift End",
      "Add. Hrs. Worked", "Hrs Worked", "Gross Pay", "Comments"
    ];
    worksheet.addRow([]);
    const columnWidths = [4, 14, 12, 12, 12, 12, 12, 12, 12, 12, 18, 12, 12, 30];
    columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
    });
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell: any) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' } // Red color
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true };
    });
    headerRow.height = 20;

    data.data.forEach((item: any, index: number) => {
      // Add weekly summary row above the current row
      if (item.weekDate) {
          let summary = `${item.weekDate.startDate} to ${item.weekDate.lastDate},\t\t\t\t     Work hrs: ${item.weekDate.totalWorkHrs},\t\t\t\t      Gross Pay: $ ${item.weekDate.grossPay},\t\t\t\t      Bank Hrs: ${item.weekDate.bankHrs}`;
          let summaryRow = worksheet.addRow([summary]);
          worksheet.mergeCells(`A${summaryRow.number}:N${summaryRow.number}`);
          summaryRow.font = { bold: true, italic: true };
          summaryRow.getCell(1).alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
          summaryRow.eachCell((cell: any) => {
              cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
              };
          });
      }
  
      if (!item.checkIn && (item.holidayInfo || item.messageType === "FULL_LEAVE")) {
          let dataRow = worksheet.addRow([
              index + 1,
              this.formatDate(item.createdAt),
              item.message, "", "", "", "", "", "", "", "", "", "", ""
          ]);
          worksheet.mergeCells(`C${dataRow.number}:N${dataRow.number}`);
          dataRow.getCell(1).alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
          dataRow.getCell(2).alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
          dataRow.getCell(3).alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
  
          // Apply background color to all cells in the row
          dataRow.eachCell((cell: any, colIndex: number) => {
              cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
              };
              cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFB6DDE8' } // Light blue color for holiday message
              };
          });
      } else {
          // Add regular data row
          let dataRow = worksheet.addRow([
              index + 1,
              this.formatDate(item.createdAt),
              item.clockIn || "-",
              item.checkIn || "-",
              item?.break1Time || "-",
              item?.lunchTime || "-",
              item?.break2Time || "-",
              item?.additionalBreakInMins || "-",
              item.clockOut || "-",
              item.checkOut || "-",
              item?.additionalWorkHr || "-",
              item?.netHours || "-",
              item?.grossPay ? '$ ' + item?.grossPay : "-",
              item?.remarks || "-"
          ]);
  
          // Apply border and text wrapping to each cell in the data row
          dataRow.eachCell((cell: any) => {
              cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
              };
              cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
  
              // Check if the date falls on a weekend (Saturday or Sunday)
              if (this.isWeekend(this.formatDate(item.createdAt))) {
                  cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFE2BAA7' } // Light red color for weekends
                  };
              }
          });
      }
  });
  
  
  

    const fileName = `Timesheet_${name}_${payCycle}`

    // Write workbook to buffer and save as file
    this.workbook.xlsx.writeBuffer().then(async (data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${fileName}.xlsx`);
      console.log("File saved successfully");
    });
    delete this.workbook;
  }
  dailyExcelExport(data: any, date?: any) {
    date = this.formatDateInMMDDYYYY(date);
    const fileName = `DailyTimesheet_${date}`;

    this.workbook = new Workbook();
    let worksheet = this.workbook.addWorksheet('Details');

    // Add title
    let title = `Daily Timesheet (${date})`;
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 12, underline: 'single', bold: true };
    titleRow.alignment = { horizontal: 'center' }; // Center align the title
    titleRow.height = 25; // Increase the height of the title row
    worksheet.mergeCells(`A1:M1`); // Merge cells from A1 to M1 for the title

    const header = [
        "SN",
        "Name",
        "Clock-in",
        "Shift Start",
        "Break 1",
        "Lunch Break",
        "Break 2",
        "Add. Break",
        "Clock-out",
        "Shift End",
        "Add. Hrs Worked",
        "Hrs Worked",
        "Comments"
    ];

    worksheet.addRow([]);
    worksheet.getColumn(1).width = 6;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(6).width = 12;
    worksheet.getColumn(7).width = 12;
    worksheet.getColumn(8).width = 12;
    worksheet.getColumn(9).width = 12;
    worksheet.getColumn(10).width = 12;
    worksheet.getColumn(11).width = 12;
    worksheet.getColumn(12).width = 12;
    worksheet.getColumn(13).width = 35;

    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell: any) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' } // Red color
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true };
    });
    headerRow.height = 20;

    data.forEach((d: any, index: number) => {
        if (!d.checkIn && (d.holidayInfo || d.messageType === "FULL_LEAVE")) {
            let dataRow = worksheet.addRow([
                index + 1,
                d.name,
                "Today is holiday", "", "", "", "", "", "", "", "", "", ""
            ]);
            worksheet.mergeCells(`C${dataRow.number}:M${dataRow.number}`);
            dataRow.getCell(1).alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
            dataRow.getCell(2).alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
            dataRow.getCell(3).alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };

            // Apply background color to all cells in the row
            dataRow.eachCell((cell: any, colIndex: number) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFB6DDE8' } // Light blue color for holiday message
                };
            });
        } else {
            const dataRow = worksheet.addRow([
                index + 1,
                d.name,
                d.checkIn || "-",
                d.checkIn || "-",
                d.break1Time ? `${d.break1Time} mins` : "-",
                d.lunchTime ? `${d.lunchTime} mins` : "-",
                d.break2Time ? `${d.break2Time} mins` : "-",
                d.additionalBreakInMins ? `${d.additionalBreakInMins} mins` : "-",
                d.clockOut || "-",
                d.checkOut || "-",
                d.additionalWorkHr || "-",
                d.workHrs || "-",
                d.remarks || "-"
            ]);
            dataRow.eachCell((cell: any) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
            });
        }
    });

    this.workbook.xlsx.writeBuffer().then(async (data: any) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, `${fileName}.xlsx`);
        console.log("File saved successfully");
    });
    delete this.workbook;
}


  // Function to check if the date is a Monday
  isMonday(dateString: string): boolean {
    const date = new Date(dateString);
    return date.getDay() === 1;
  }

}
