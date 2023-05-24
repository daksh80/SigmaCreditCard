import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { details } from 'details.interface';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  detailsList: details[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers().subscribe(
      (data) => {
        this.detailsList = data;
        console.log(this.detailsList); // Use the data as per your requirement
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getUsers(): Observable<details[]> {
    return this.http.get<details[]>('assets/localdb.json');
  }
}

