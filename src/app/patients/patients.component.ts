import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  appointment:any[]=[];
  displayedColumns: string[] = ['date_of_appointment', 'time_of_appointment', 'treatment', 'name', 'email', 'phoneNumber', 'doctor'];
  dataSource = new MatTableDataSource<any>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.http.get<any[]>('https://sekhar-mobile.onrender.com/get').subscribe(
      (response) => {
        console.log("success", response);
        this.assignData(response);
      },
      (error) => {
        console.log('Error fetching appointments:', error);
      }
    );
  }

  assignData(response: any) {
   for (let i = 0; i < response.forms.length; i++) {
    const element = response.forms[i];
    this.appointment.push(element)
    this.dataSource.data = this.appointment;
    console.log("sspppp",this.appointment)
    console.log("erere",this.dataSource.data)
   }
  }
  
}
