import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { creditcard } from 'creditcard.interface';
import { details } from 'details.interface';
import { Observable } from 'rxjs';
import { SharedService } from 'src/shared.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  creditList: creditcard[] = [];

  constructor(private http: HttpClient, private route: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getUsers().subscribe(
      (data) => {
        this.creditList = data;
        console.log(this.creditList);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getUsers(): Observable<creditcard[]> {
    return this.http.get<creditcard[]>('http://localhost:3000/addcreditcard');
  }

  onCardClick(detail: creditcard) {
    console.log(detail);
  }

  update(detail: creditcard): void {
    this.sharedService.setCreditCardArray([detail]); // Pass an array with a single credit card object
    this.route.navigate(['updatecreditdetails']);
    console.log(detail);
  }

  delete(id: string): void {
    this.http.delete('http://localhost:3000/addcreditcard/' + id).subscribe((data) => {
      console.log(data);
      this.getUsers();
    });
  }

  ActiveIn(): void {
    // Implement your logic for the ActiveIn function
  }
}
