// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-resume-management',
//   templateUrl: './resume-management.component.html',
//   styleUrl: './resume-management.component.css'
// })
// export class ResumeManagementComponent {

// }


import { saveAs } from 'file-saver';
import { Component, OnInit, PLATFORM_ID, Inject, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ShowerrorsService } from '../../../../../app/shared/providers/showerrors.service';
import { JsProfileService } from '../../../../../app/jobseeker/providers/js-profile.service';
import { ResumeuploadService } from '../../../../core/providers/resumeupload.service';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { JsUploadResumeComponent } from '../../../../../app/jobseeker/modals/js-upload-resume/js-upload-resume.component';
import { NotificationsallService } from '../../../../../app/providers/notifications.service';
import { ResumeParsedDataComponent } from '../../../../../app/jobseeker/modals/resume-parsed-data/resume-parsed-data.component';
import { environment } from '../../../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { PortfolioserviceService } from '../../../../../app/jobseeker/providers/portfolioservice.service';
import { DeleteComponent } from '../../../../core/modals/delete/delete.component';


@Component({
  selector: 'resume-management-home',
  templateUrl: './resume-management-home.component.html',
  styleUrls: ['./resume-management-home.component.scss']
})
export class ResumeManagementHomeComponent implements OnInit {
  resumeData: any;
  downloadResumeData: any;
  resumeDataSet: any;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    public dialog: MatDialog,
    private router: Router,
    public snack: ShowerrorsService,
    public resumeservice: ResumeuploadService,
    private profileser: JsProfileService,
    private profileSummary:PortfolioserviceService,
    public notifications: NotificationsallService, private title: Title
    ) {
      this.title.setTitle('Resumes | GradSiren');}

  ngOnInit() {
    this.getAllResumes();
  }

  uploadResume() {
    if(this.resumeData && this.resumeData.length >= 4 ){
      // this.snack.openSnackBar('failure', `Maximum you can upload 4 Resumes! If you want to upload, delete existing resume`);
      this.snack.openSnackBar('failure', `You cannot upload more than four resumes; to add a new resume, delete an existing one.`);
  } else{
    this.resumeDataSet = {
      status: 'Upload Your Resume',
      labelTitle: 'Resume Title',
      statusId:'myprofile'
    }
    this.dialog.open(JsUploadResumeComponent, {
      width: '650px',
      data: this.resumeDataSet,
      disableClose: true
    }).afterClosed().subscribe(data => {
      if (data && data.openparse) {
        this.dialog.open(ResumeParsedDataComponent, {
          width: '1050px',
          data: data.serverdata,
          disableClose: true
        }).afterClosed().subscribe(res => {
          if (res === 'success') {
            this.snack.openSnackBar('success', 'Resume uploaded successfully');
            this.getAllResumes();
          } else {
          }
        });
      } else if (data && data.filetype) {
        //  console.log(data);
        //  this.allprofileDetails.jobSeekerResumeStatus = 'ResumeUploaded';
        //  this.allprofileDetails.resume_extension = '.' + data.filetype;
        this.snack.openSnackBar('success', 'Resume uploaded successfully');
        this.getAllResumes();
      }
    });
  }
  }
  isenableresumeData:boolean=false;
  getAllResumes() {
    this.resumeservice.getAllResumes().subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.isenableresumeData = false;
      this.resumeData = data.map.allResumes;
      }else{
       this.isenableresumeData = true;
      }
    })
  }
  changeMode(id) {
    this.resumeservice.defaultResume(id).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.getAllResumes();
      }
    })
  }
  downloadResume(id) {
    this.downloadResumeData = this.resumeData.filter(tt => tt.resumeId == id);
    this.resumeservice.downloadresumeData(id).subscribe(data => {
      saveAs(data,this.downloadResumeData[0].resumeTitle + this.downloadResumeData[0].resumeExtension);
    });
  }
  editResume(id) {
    this.downloadResumeData = this.resumeData.filter(tt => tt.resumeId == id);
    this.resumeDataSet = {
      resumeId: id,
      status: 'Edit Your Resume',
      title: this.downloadResumeData[0].resumeTitle,
      labelTitle: 'Edit Resume Title',
      Mode: 'edit',
      statusId:'myprofile',
      extension:this.downloadResumeData[0].resumeExtension
    }
    this.dialog.open(JsUploadResumeComponent, {
      width: '650px',
      data: this.resumeDataSet,
      disableClose: true
    }).afterClosed().subscribe(data => {
      if (data && data.openparse) {
        this.dialog.open(ResumeParsedDataComponent, {
          width: '1050px',
          data: data.serverdata,
          disableClose: true
        }).afterClosed().subscribe(res => {
          if (res === 'success') {
            this.snack.openSnackBar('success', 'Resume updated successfully');
            this.getAllResumes();
          } else {
          }
        });
      } else if (data &&(data.filetype || data.Mode =='edit')) {
        //  console.log(data);
        //  this.allprofileDetails.jobSeekerResumeStatus = 'ResumeUploaded';
        //  this.allprofileDetails.resume_extension = '.' + data.filetype;
        this.snack.openSnackBar('success', 'Resume updated successfully');
        this.getAllResumes();
      }
    });
  }

  openConfirmDialog(id){
    this.dialog.open(DeleteComponent,{ data:id }).afterClosed()
    .subscribe(res=>{
      if(res) this.deleteResume(id)
    })
  }

  deleteResume(id) {
    this.resumeservice.deleteResume(id).subscribe(data => {
      if (data.status == 'SUCCESS') {
        this.snack.openSnackBar('success', 'Resume deleted successfully');
        this.getAllResumes();
      }else if(data.status =='DELETE_RESUME_ALERT'){
        this.snack.openSnackBar('failure', data.message);
      }
    })
  }


  viewResume(id){
    let downloadResumeData = this.resumeData.filter(tt => tt.resumeId == id);
    if (isPlatformBrowser(this.platformId)) {
          window.open(`https://docs.google.com/viewer?url=${environment.JS_API}/jobseeker/resume/viewJobSeekerResume?q=` + downloadResumeData[0].encodedResumePath + `&embedded=true`, '_blank', 'location=no,enableviewportscale=yes,height=750,width=850,scrollbars=yes,status=yes,left=300,scrollTop=yes,resizable=yes');
        }
    }
}
