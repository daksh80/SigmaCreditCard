import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { creditcard } from 'creditcard.interface';
import Highcharts from 'highcharts';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/shared.service';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.css']
})
export class EmiCalculatorComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService
  ) {}

  uid: string | undefined;
  selectedUserCreditCard: creditcard[] | undefined;
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
  totalInterest=0;
  interest=0;
  creditAMount= 500000;
  monthmax= 36;
  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap?.get("uid") || "";
    this.sharedService
      .getUserCreditCard(this.uid)
      .subscribe((creditCards: creditcard[]) => {
        this.selectedUserCreditCard = creditCards;
        console.log("hellloooo",this.selectedUserCreditCard);
        // this.updateChart();
      });
  }
   /**
   * @description Highchart(library) for loanChart in loanchart it's shows details Loan Amount,Rate of Interest,Loan Term,Total Interest,Total Amount,Monthly Installment
   * Updates the loanChart using Highcharts library
   * @chartType pie
   * @title Loan Details
   */
  //  updateChart() {
  //   const chart = Highcharts.chart("loanChart", {
  //     chart: {
  //       type: "pie",
  //     },
  //     title: {
  //       text: "Loan Details",
  //     },
  //     tooltip: {
  //       valueSuffix: "",
  //     },
  //     plotOptions: {
  //       pie: {
  //         allowPointSelect: true,
  //         cursor: "pointer",
  //         dataLabels: {
  //           enabled: true,
  //           format: "{point.name}: {y}",
  //         },
  //         showInLegend: true,
  //       },
  //     },
  //     series: [
  //       {
  //         name: "Value",
  //         colorByPoint: true,
  //         type: "pie",
  //         innerSize: "75%",
  //         data: [],
  //       },
  //     ],
  //   } as any);
  
  //   const interest =  ((this.loanTerm) *this.loanAmount) * (this.rateOfInterest / 100) ;
  //   const totalAmount = this.loanAmount + interest;
  //   const monthlyInstallment = totalAmount / (this.loanTerm * 12);
  //   console.log("loan term",this.loanTerm);
  //   const totalInterest = interest; // Calculate total interest based on loan term
  
  //   chart.series[0].setData([
  //     { name: "Loan Amount", y: this.loanAmount },
  //     { name: "Rate of Interest", y: this.rateOfInterest },
  //     { name: "Loan Term", y: this.loanTerm },
  //     { name: "Total Interest", y: interest}, // Update total interest value
  //     { name: "Total Amount", y: totalAmount },
  //     { name: "Monthly Installment", y: monthlyInstallment },
  //   ]);
  // }
  
  /**
   * @description this function calculateLoan using(intrest, totalAmount,monthlyInstallment)
   * const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    const monthlyInstallment = totalAmount / (this.loanTerm * 12);
    and call updatechart() function
   *Calculates loan details
   */
    calculateLoan() {
       const interest = (this.loanAmount) * (this.rateOfInterest / 100) ;
      const totalAmount = this.loanAmount + interest;
      const monthlyInstallment = totalAmount / (this.loanTerm * 12);
      const totalInterest = interest// Calculate total interest based on loan term
    
      console.log("Interest:", totalInterest);
      console.log("Total Amount:", totalAmount);
      console.log("Monthly Installment:", monthlyInstallment);
      // this.updateChart();
    }
   /**
   * @description this function calculate monthly installment 
   * const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    const monthlyInstallment = totalAmount / (this.loanTerm * 12);
   * Calculates the monthly installment
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
   * Calculates the total amount
   * @returns The calculated total amount value
   */
  calculateTotalAmount() {
    const interest = this.loanAmount * (this.rateOfInterest / 100);
    const totalAmount = this.loanAmount + interest;
    return totalAmount.toFixed(2);
  }
 /**
   * @description this function calculate intrest 
   * Calculates the interest
   * @returns The calculated interest value
   */

 calculateInterest() {
  const interest = this.loanAmount * (this.rateOfInterest / 100);
   this.totalInterest = interest
  return this.totalInterest.toFixed(2);
}
}
