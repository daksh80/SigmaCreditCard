import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecreditdetailsComponent } from './updatecreditdetails.component';

describe('UpdatecreditdetailsComponent', () => {
  let component: UpdatecreditdetailsComponent;
  let fixture: ComponentFixture<UpdatecreditdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatecreditdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatecreditdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
