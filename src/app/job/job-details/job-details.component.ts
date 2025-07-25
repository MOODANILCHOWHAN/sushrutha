import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit{

  jobDetails:any;
  constructor(private http:HttpClient,private params:ActivatedRoute){
   
  }

  ngOnInit(): void {
    this.readParams();
  }

  readParams() {
    this.params.paramMap.subscribe({
      next: (res) => {
        const id = res.get('id'); // ✅ use .get('id') to retrieve the value
        console.log('ID:', id);
        this.getDetails(id); // pass the actual string ID
      },
      error: (err) => {
        console.log('Error:', err);
      }
    });
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
    const api=`https://jobs-ut20.onrender.com/getAllJobs/${filter}`
    this.http.get<any>(api).subscribe({
      next:(res)=>{
        console.log(res);
        this.jobDetails=res;
      },error:(err)=>{
        console.log(err)
      }
    })
  }
}
