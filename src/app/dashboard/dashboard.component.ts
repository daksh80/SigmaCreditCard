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
import { details } from "details.interface";
/**
 * Dashboard Component
 */

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
  creditAMount =0;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  loanAmount = 0;
  rateOfInterest = 0;
  loanTerm = 0;
  monthmax=36;
  roi: string | undefined;
  creditroi: emicalculator[] = [];
  getdata: string | null | undefined;
  loggedInUser : details | null | undefined;
  bgImage:any; 


/**
   * OnInit lifecycle hook
   */
  ngOnInit(): void {

    this.loggedInUser = null;
      const logindata = localStorage.getItem("logindata");
      if (logindata !== null) {
         
      this.loggedInUser = JSON.parse(logindata);
      }else{
        this.router.navigate(['']);
      }
    this.uid = this.route.snapshot.paramMap?.get("uid") || "";
    this.sharedService.setuid(this.uid);
     
      console.log("this.loggedInUser",this.loggedInUser?.uid);
      console.log("this.uid ngonint", this.uid)
      if(this.loggedInUser?.uid !== this.uid && this.loggedInUser?.uid!==undefined){
        this.router.navigate([`dashboard/${this.loggedInUser?.uid}`]);
      }else{
        // this.router.navigate(['']);
        // localStorage.removeItem('logindata');
      }
    this.sharedService
      .getUserCreditCard(this.loggedInUser?.uid)
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
      

      //this.bgImage change card background image
      //this.bgImage = this.currentCardBackground();

      
  }

  /**
   * @description this function takes emicalculator array from json-server
   /**
   * Gets emicalculator data from the server
   * @returns Observable of emicalculator[]
   */
  private getEmicalculator(): Observable<emicalculator[]> {
    return this._http.get<emicalculator[]>("http://localhost:3000/emiCalculator");
  }

  /**
   * @description this function takes emicalculator data and store into emicalculateList
   * Loads emicalculator data and stores it in emicalculateList
   */

  loadUsers(): void {
    this.getEmicalculator().subscribe((users: emicalculator[]) => {
      this.emicalculateList = users;
      console.log("emicalculator",this.emicalculateList); 
    });
  }
  
/**
 * @description this function store roi(Rate of intreset) on the basis of loanType(Personal, car, Home & Gold) and 
 * Sets the rate of interest based on the loan type
 * @param loanT The loan type
 */
  loanType(loanT: any): void{
    
      console.log("Loan Type",loanT);
      this.getroi(loanT)
      .subscribe((creditCards: emicalculator[]) => {
        this.creditroi= creditCards;
        console.log("12121loantype", this.creditroi[0].roi);
        this.rateOfInterest = toInteger(this.creditroi[0].roi)   
        this.sharedService.getcreditLimit().subscribe(limit => {
          this.loanAmount = toInteger(limit)
          this.creditAMount= this.loanAmount
          console.log("this is limit",limit);
        });     
      });

      this.rateOfInterest=0;
  }

  /**
   * @description this function filter data from json on  the  basis of loan type and filter 
  * Filters emicalculator data based on the loan type
   * @param loanT The loan type
   * @returns Observable of emicalculator[] 
   */

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

  /**
   * Gets a random image for the card background
   * @returns The URL of the background image
   */
  currentCardBackground () {
    let random = Math.floor(Math.random() * 25 + 1)
    return `assets/images/${random}.jpeg`; 
  }


  /**
   * @description Highchart(library) for loanChart in loanchart it's shows details Loan Amount,Rate of Interest,Loan Term,Total Interest,Total Amount,Monthly Installment
   * @chartType pie
   * Updates the loanChart using Highcharts library
   * @title Loan Details
   */
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

  /**
   * @description this function calculateLoan using(intrest, totalAmount,monthlyInstallment)
   * const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    const monthlyInstallment = totalAmount / (this.loanTerm * 12);
    and call updatechart() function
   * Calculates loan details
   */

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
  /**
   * @description this function calculate monthly installment 
   * const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    const monthlyInstallment = totalAmount / (this.loanTerm * 12);
   * Calculates monthly installment
   * @returns The calculated monthly installment value
   */
  calculateMonthlyInstallment() {
    const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    const monthlyInstallment = totalAmount / (this.loanTerm * 12);
    return monthlyInstallment.toFixed(2);
  }

  /**
   * @description this function calculate Total amount = loanAmount + roi(rate of intreset)
   * Calculates total amount
   * @returns The calculated total amount value
   */
  calculateTotalAmount() {
    const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    return totalAmount.toFixed(2);
  }
  /**
   * Calculates interest
   * @returns The calculated interest value
   */

  calculateInterest() {
    const interest = this.loanAmount * (this.rateOfInterest / 100);
    return interest.toFixed(2);
  }
}
