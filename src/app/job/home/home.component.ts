import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponents implements OnInit
 {
  filter:any='';
  searchText:any='';
  jobs:any=[];
  constructor(private http:HttpClient,private route:Router)
  {

  }
  ngOnInit(): void {
   this.getJobs();
  }
  
  getJobs(){
    const api='https://jobs-ut20.onrender.com/getAllJobs'
    this.http.get<any>(api).subscribe({
      next:(res)=>{
        console.log(res);
        this.jobs=res;
      },error:(err)=>{
        console.error(err)
      }
    })
  }
  applyFilter(){
    this.route.navigate([''],{queryParams:{filter:this.filter,text:this.searchText}})
  }
  getDetails(element:any){
    this.route.navigate(['',element.id])
  }
}
