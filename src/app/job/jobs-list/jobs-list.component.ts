import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.css'
})
export class JobsListComponent implements OnInit{

  jobList:any[]=[];

  constructor(private http:HttpClient, private readonly router:Router){

  }

  ngOnInit(): void {
    const url='https://jobs-ut20.onrender.com/getAllJobs';
    this.http.get<any>(url).subscribe({
      next:(res)=>{
        console.log(res)
        this.jobList=res;
      }
    })

    
  }

  navToDescription(job:any){
    console.log(job)
    this.router.navigate(['jobdetails', job._id]);

  }
}
