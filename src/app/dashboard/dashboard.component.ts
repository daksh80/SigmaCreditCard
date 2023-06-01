import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { creditcard } from "creditcard.interface";
import * as Highcharts from "highcharts";
import { catchError, map,Observable, of, Subscription } from "rxjs";
import { SharedService } from "src/shared.service";
// import * as _ from "lodash";
import {  ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { emicalculator } from "emicalculator.interface";
import { FormControl } from "@angular/forms";
import { toInteger } from "lodash";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private _http: HttpClient,
  ) {}
  selectedFW = new FormControl();
  frameworks: string[] = ['Personal', 'Car', 'Home','Gold'];
  uid: string | undefined;
  selectedUserCreditCard: creditcard[] | undefined;
  selectedcreditList: creditcard[] | null = null;
  creditList: creditcard[] = [];
  emicalculateList: emicalculator[]= [];
  highcharts = Highcharts;
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  loanAmount = 0;
  rateOfInterest = 0;
  loanTerm = 0;
  roi: string | undefined;
  creditroi: emicalculator[] = [];
  getdata: string | null | undefined;


  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap?.get("uid") || "";
    this.sharedService.setuid(this.uid);
    this.sharedService
      .getUserCreditCard(this.uid)
      .subscribe((creditCards: creditcard[]) => {
        this.selectedUserCreditCard = creditCards;
        console.log("hellloooo",this.selectedUserCreditCard);
        this.updateChart();
        this.loadUsers();
      });

      this.sharedService.getEmicreditcardArray().subscribe((selectedArray: creditcard[] | null) => {
        //this.selectedcreditList = selectedArray;
        this.creditList = selectedArray!;
        console.log("this.selectedcreditList",this.creditList);
        
      });

      this.rateOfInterest = 0;
      this.loanAmount=0;
      
      // this.sharedService.cardComponentSubject.subscribe({
      //   next: (v) => this.sharedService.getcreditLimit().subscribe(limit => {
      //     console.log("this is limit",limit);
      //   })
      // })
  }

  private getEmicalculator(): Observable<emicalculator[]> {
    return this._http.get<emicalculator[]>("http://localhost:3000/emiCalculator");
  }

  loadUsers(): void {
    this.getEmicalculator().subscribe((users: emicalculator[]) => {
      this.emicalculateList = users;
      console.log("emicalculator",this.emicalculateList); 
    });
  }
  

  loanType(loanT: any): void{
    
      console.log("Loan Type",loanT);
      this.getroi(loanT)
      .subscribe((creditCards: emicalculator[]) => {
        this.creditroi= creditCards;
        console.log("12121loantype", this.creditroi[0].roi);
        this.rateOfInterest = toInteger(this.creditroi[0].roi)   
        this.sharedService.getcreditLimit().subscribe(limit => {
          this.loanAmount = toInteger(limit)
          console.log("this is limit",limit);
        });     
      });

      this.rateOfInterest=0;
  }


  getroi(loanT: any | undefined): Observable<emicalculator[]>{

    return this.getEmicalculator().pipe(
      map((emidata: emicalculator[])=>{
        console.log('flag',emidata);
         return emidata.filter((card: emicalculator) => card.LoanType === loanT);
      }),
      catchError((err) => {
        console.log(err);
        // return of([]);
        this.getdata = localStorage.getItem('data');
        const carddata = JSON.parse(this.getdata || '');
        const roidataArray = carddata?.emiCalculator || [];
        console.log("roi Credit Card Details:", roidataArray);
        return of (roidataArray.filter((card: emicalculator) => card.LoanType === loanT));
      })
    );
  }

  // getroi(loanT:any): Observable<emicalculator[]>{
  //  return this.getEmicalculator().pipe(
  //   map((emidata) =>{
  //     console.group('flag1',emidata)
  //     return emidata
  //   })
  //   )

    
  // }

  
  updateChart() {
    const chart = Highcharts.chart("loanChart", {
      chart: {
        type: "pie",
      },
      title: {
        text: "Loan Details",
      },
      tooltip: {
        valueSuffix: "",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {y}",
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Value",
          colorByPoint: true,
          type: "pie",
          innerSize: "75%",
          data: [],
        },
      ],
    } as any);

    const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    const monthlyInstallment = totalAmount / (this.loanTerm * 12);

    chart.series[0].setData([
      { name: "Loan Amount", y: this.loanAmount },
      { name: "Rate of Interest", y: this.rateOfInterest },
      { name: "Loan Term", y: this.loanTerm },
      { name: "Total Interest", y: interest },
      { name: "Total Amount", y: totalAmount },
      { name: "Monthly Installment", y: monthlyInstallment },
    ]);
  }

  

  calculateLoan() {
    console.log()
    const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    const monthlyInstallment = totalAmount / (this.loanTerm * 12);

    console.log("Interest:", interest);
    console.log("Total Amount:", totalAmount);
    console.log("Monthly Installment:", monthlyInstallment);
    this.updateChart();
  }
  calculateMonthlyInstallment() {
    const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    const monthlyInstallment = totalAmount / (this.loanTerm * 12);
    return monthlyInstallment.toFixed(2);
  }

  calculateTotalAmount() {
    const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    return totalAmount.toFixed(2);
  }

  calculateInterest() {
    const interest = this.loanAmount * (this.rateOfInterest / 100);
    return interest.toFixed(2);
  }
}
