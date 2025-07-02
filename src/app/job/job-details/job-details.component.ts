import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit{

  constructor(private http:HttpClient,private params:ActivatedRoute){
   
  }

  ngOnInit(): void {
    
  }
  readParams(){
    this.params.paramMap.subscribe({
      next:(res)=>{
        console.log(res);
        this.getDetails(res)
      },error:(err)=>{
        console.log(err)
      }
    })
  }
  readQueryParams(){
    this.params.queryParams.subscribe({
      next:(res)=>{
        console.log(res);
        const filter=res['filter'];
        const searchText=res['searchText'];
        // this.getDetails(filter,searchText);
      },error:(err)=>console.log(err)
    })
  }
  getDetails(filter:any){
    const api=`www.com${filter}`
    this.http.get<any>(api).subscribe({
      next:(res)=>{
        console.log(res)
      },error:(err)=>{
        console.log(err)
      }
    })
  }
}
