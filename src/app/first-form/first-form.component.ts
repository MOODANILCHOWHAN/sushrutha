import { Component,OnInit } from '@angular/core';
// import { App } from '@capacitor/app';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-first-form',
  templateUrl: './first-form.component.html',
  styleUrl: './first-form.component.css'
})
export class FirstFormComponent implements OnInit{

  formData={
    name:'',
    email:'',
    phoneNumber:'',
    date_of_appointment:'',
    time_of_appointment:'',
    treatment:'',
    doctor:'',
    message:''
  }
  submit(formData:any)
  {
    this.formData=formData
    // console.log(this.formData)
    this.postingTheForm()
  }
  
  constructor(private http:HttpClient){}
  ngOnInit(): void {
   
  }

  postingTheForm()
  {
    console.log("inside the post",this.formData)
    const apiUrl='https://sekhar-mobile.onrender.com/postformdata'
    this.http.post(apiUrl,this.formData).subscribe(
      (response)=>{
          console.log("sucessfully post the form",response)
      },
      (error)=>
      {
        console.log("error",error);
      }
    )
  }
}
