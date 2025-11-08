// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-create-post-card',
//   templateUrl: './create-post-card.component.html',
//   styleUrl: './create-post-card.component.css'
// })
// export class CreatePostCardComponent {

// }

import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../../../core/modals/loader/loader.component';
import { Subscription } from 'rxjs';
import { FeedService } from '../../../jobseeker/providers/feed.service';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { QuillModules, QuillEditorComponent } from 'ngx-quill';
import { WhoCanSeeCardComponent } from '../who-can-see-card/who-can-see-card.component';
import { PublicportfolioService } from '../../../new-public/providers/publicportfolio.service';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'create-post-card',
  templateUrl: './create-post-card.component.html',
  styleUrls: ['../../../jobseeker/modules/personal-feed/feed/feed.component.scss']
})
export class CreatePostCardComponent implements OnInit {

  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;

  discardModalRef: BsModalRef;
  whoCanSeePostModalRef: BsModalRef;
  modalRef: BsModalRef;
  videoModalRef: BsModalRef;
  whoCanCommentOnPostModalRef: BsModalRef;
  ConnectioGroupTemplate: BsModalRef;
  userGroupsModalRef: BsModalRef;
  showFeedOnProfRef: BsModalRef;
  whoCanSeeValue = "anyone";
  whoCanSeePostFake = "anyone";
  componentType:any;
  feedPostSelectGroup = { id: null, name: null, logoPath: null };
  displayImage: any;
  image: any;
  dispalyfileData: any;
  dispalyfile: any;
  videoUrl :any;
  videoDescription :any;
  sanitVideoUrl ;
  showFeedMore = false;
  displayTags: Boolean = false;
  fileToUpload: any;
  createPostFileLoading: Boolean = false;
  selectedTags = [];
  feedContent: any;
  selectedSpecificConnectionsDets = [];
  selectedExceptConnectionsDets = [];
  whoCanCommentValue = "anyone";
  postFeedLoader: Boolean = false;
  fileSubscription = new Subscription();
  feedItems: any;
  connectionsSearchText = "";
  arrayToString = [];
  users = [];
  selectedData = [];
  usersListExcept = [];
  selectedDataExcept = [];
  tagSuggetions = [];
  currentPage = 1;
  editFeed: any;
  feedData = false;
  paginationDatacame = false;
  totalPages: number | undefined;
  feedTypeSelected = "Recommend";
  shareData = {};
  shareFeed: any;
  jsconnectionsCount: boolean = false;
  searchGroupPage = 1;
  groupSearchText = "";
  userGroups: any;
  videoForm: FormGroup | undefined;
  searchGroupPageLast: any;
  searchGroupPageTotalRecords: any;
  whoCanCommentstyle: string = "anyone";
  connectionsSearchTextSpecific = "";
  selecteddata1 = true;
  selecteddata2 = true;
  atValues = [];
  @Output() onClose = new EventEmitter();
  sharedFeedTags: any;
  openTemplateType: any;
  openWhoCanComment:boolean = false;
  hashTagInfo: any;
  companyOverViewDets: any;
  shareOnProfileData: any;
  sharedSanitVideoUrl: any;
  isCompanyOrInternship: any;
  ismultiPartFileDelete: boolean | undefined;
  isenable:boolean= false;
  duplicatehashtag:any;
  constructor( 
    private modalService: BsModalService,
    private router: Router,
    public dialogRef: MatDialog,
    private sanitizer: DomSanitizer,
    private feed: FeedService,
    public options: ModalOptions,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private publicPortfolio: PublicportfolioService,
    private config: NgSelectConfig,
    @Inject(DOCUMENT) private CustomDocument: Document,) { 
      const dataToDisplay = this.options.initialState;
      if(dataToDisplay['actionType'] === 'edit'){
        this.feedContent = dataToDisplay['feedContent'];
        this.whoCanSeeValue=dataToDisplay['whoCanSeeValue'];
        this.editFeed=dataToDisplay['editFeed'];
        this.whoCanCommentValue=dataToDisplay['whoCanCommentValue'];
        this.sharedFeedTags=dataToDisplay['sharedFeedTags'];
        this.displayTags=dataToDisplay['displayTags'];
        this.sanitVideoUrl=dataToDisplay['sanitVideoUrl'];
        this.shareFeed=dataToDisplay['shareFeed'];
        this.users=dataToDisplay['users'];
        this.displayImage = dataToDisplay['displayImage'];
        this.dispalyfileData = dataToDisplay['dispalyfileData'];
        this.selectedTags = dataToDisplay['selectedTags']??[];
        this.shareFeed = false;
        this.hashTagInfo = [...dataToDisplay['selectedTags']];
        this.companyOverViewDets = dataToDisplay['companyDetails'];
      }
      if(dataToDisplay['actionType'] === 'share'){
        this.feedContent = dataToDisplay['feedContent'];
        this.whoCanSeeValue=dataToDisplay['whoCanSeeValue'];
        this.whoCanSeePostFake=dataToDisplay['whoCanSeeValue'];
        this.whoCanCommentValue=dataToDisplay['whoCanCommentValue'];
        this.sharedFeedTags=dataToDisplay['sharedFeedTags'];
        // this.displayTags=dataToDisplay['displayTags'];
        this.sanitVideoUrl=dataToDisplay['sharedSanitVideoUrl'];
        this.shareFeed=dataToDisplay['shareFeed'];
        this.users=dataToDisplay['users'];
        this.editFeed = false;
        // this.hashTagInfo = [...dataToDisplay['selectedFeedTags']];
        this.feedPostSelectGroup ={
          'name' : dataToDisplay['groupInfo']?.groupName,
          'id':+dataToDisplay['groupInfo']?.groupId,
          'logoPath':null
        }
        this.editFeed=false;
        this.companyOverViewDets = dataToDisplay['companyDetails'];
      }
      if(dataToDisplay['actionType'] === 'openTemplates'){
        this.openTemplateType = dataToDisplay['fileType'];
        this.whoCanSeePostFake = dataToDisplay['whoCanSeeValue'];
        this.selectedTags = dataToDisplay['selectedFeedTags'] ?? [];
        if(dataToDisplay['selectedFeedTags']){
          this.hashTagInfo = [...dataToDisplay['selectedFeedTags']];
        }
          this.feedPostSelectGroup ={
            'name' : dataToDisplay['groupInfo']?.groupName,
            'id':+dataToDisplay['groupInfo']?.groupId,
            'logoPath':null
          }
        this.companyOverViewDets = dataToDisplay['companyDetails'];
        this.shareFeed = false;
        this.editFeed = false;
        this.feedContent = null;
      }
      this.config.notFoundText = 'This hashtag is not valid';
     }

  ngOnInit(): void {
    this.getHashTagSuggetions("a");
    this.videoForm = this.fb.group({
      videoDescrip: ["", [Validators.maxLength(1000)]],
      videourl: ["", [Validators.required]],
    });
    this.componentType = window.location.href.includes("groups") ? 'group':
                          window.location.href.includes("hashtag-profile") ? 'hashtags':
                          window.location.href.includes("posts") ? 'company':
                          window.location.href.includes("internship-posts")?'internship':null;
    
    this.isCompanyOrInternship = ['company', 'internship'].includes(this.componentType);
  }
  ngAfterViewInit(){
    if(this.openTemplateType){
      if(this.openTemplateType === 'photo'){
        document.getElementById('photoButton').click();
      }else if(this.openTemplateType === 'file'){
        document.getElementById('fileButton').click();
      }else if(this.openTemplateType === 'video'){
        document.getElementById('videoButton').click()
      }else{

      }
    }
  }
  discardPost(template: TemplateRef<any>) {
    this.discardModalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "confirmDiscard modal-sm" })
    );
  }
  whoCanSeePostModel() {
    const initialState = {
      'feedContent':this.feedContent,
      'whoCanSeeValue':this.whoCanSeeValue,
      'whoCanSeePostFake':this.whoCanSeePostFake,
      'editFeed':this.editFeed,
      'whoCanCommentValue':this.whoCanCommentValue,
      'sharedFeedTags':this.sharedFeedTags,
      'displayTags':this.displayTags,
      'sanitVideoUrl':this.sanitVideoUrl,
      'users':this.users,
      'actionType':'openTemplates',
      'selectedSpecificConnectionsDets':this.selectedSpecificConnectionsDets,
      'selectedExceptConnectionsDets':this.selectedExceptConnectionsDets,
      'feedPostSelectGroup':this.feedPostSelectGroup,

    }
    let modalConfig = { backdrop: true, ignoreBackdropClick: false };
    this.whoCanSeePostModalRef = this.modalService.show(WhoCanSeeCardComponent, 
      Object.assign({}, modalConfig, {class: 'modal-dialog-centered', initialState
      })
      );
    this.whoCanSeePostModalRef.content.closeWhoCanSee.subscribe((result: { data: { whoCanSeeValue: string; feedPostSelectGroup: { id: null; name: null; logoPath: null; }; selectedSpecificConnectionsDets: never[]; selectedExceptConnectionsDets: never[]; }; }) =>{
      this.whoCanSeePostModalRef.hide();
      this.whoCanSeePostFake = result.data.whoCanSeeValue;
      this.whoCanSeeValue = result.data.whoCanSeeValue;
      this.feedPostSelectGroup = result.data.feedPostSelectGroup;
      this.selectedSpecificConnectionsDets = result.data.selectedSpecificConnectionsDets;
      this.selectedExceptConnectionsDets = result.data.selectedExceptConnectionsDets;
    })
  }

  removeImg() {
    this.ismultiPartFileDelete = true;
    this.displayImage = null;
    this.image = null;
    const fileUpload = this.CustomDocument.getElementById(
      "fileUpload"
    ) as HTMLInputElement;
    fileUpload.value = "";
  }
  deleteFeedItemForFile() {
    this.conns
      .deleteFeedItemFile(this.dispalyfileData.feedItemId)
      .subscribe((res: { status: string; message: any; }) => {
        if (res.status === "SUCCESS") {
          
          this.dispalyfile = null;
          this.dispalyfileData = null;
        } else {
          
        }
      });
  }
  loadHashtagProfile(hashTagName: any) {
    this.modalRef.hide();
    this.router.navigate(["/mynetwork/hashtag-profile/" + this.removeHash(hashTagName)]);
  }
  returnPostDescription(postDescription: string) {
    const p = this.CustomDocument.createElement('p');
    p.innerHTML = postDescription;
    const txtCntLen = p.textContent.length;
    const splitPD = p.textContent.split('@');
    let stringWithoutTags = postDescription?.replace(/<[^>]+>/g, '')?.replace(/\sdata-(value|link)="[^"]*"/g, '');
    const sliceIndex = stringWithoutTags.length <= postDescription.length/5 ? 400 * splitPD.length : 
                       stringWithoutTags.length >= postDescription.length - 10 && postDescription.length <400?postDescription.length:400;
    if( txtCntLen >= 400 ) {
      return postDescription.slice(0,sliceIndex);
    } else {
      return postDescription;
    }

  }
  uploadImage(event: { target: { files: any[]; }; }) {
    this.image = event.target.files[0];
    let fr = new FileReader();
    fr.readAsDataURL(this.image);
    fr.onload = (event: any) => {
      this.displayImage = fr.result;
      this.ismultiPartFileDelete = false;
    };
  }
  uploadFile(event: { target: { files: any[]; }; }) {
    this.dialogRef.open(LoaderComponent, {
      data: { type: 1, size: "" },
      panelClass: "loader-class",
      disableClose: true,
    });
    let dispalyfileData1 = event.target.files[0];
    this.fileToUpload = dispalyfileData1;
    if (this.fileToUpload === undefined) {
      this.dialogRef.closeAll();
    }
    let filetype = this.fileToUpload.name
      .substr(this.fileToUpload.name.lastIndexOf(".") + 1)
      .toUpperCase();
    if (filetype === "TXT") {
      this.dialogRef.closeAll();
      this.createPostFileLoading = false;
      this.snack.openSnackBar("failure", ".txt files cannot be uploaded.");
      return;
    }
    if (
      filetype !== "PDF" &&
      // filetype !== "TXT" &&
      filetype !== "DOCX" &&
      // filetype !== "DOC" &&
      filetype !== "XLSX" &&
      filetype !== "XLS" &&
      filetype !== "PPT" &&
      filetype !== "PPTX"
    ) {
      this.dialogRef.closeAll();
      this.snack.openSnackBar(
        "failure",
        "Please upload the file with extension .pdf , .docx , .xlsx , .xls , .ppt , .pptx"
      );
    } else if (
      this.fileToUpload.size < 1024 ||
      this.fileToUpload.size > 5242880
    ) {
      this.dialogRef.closeAll();
      this.snack.openSnackBar(
        "info",
        "File upload size must be between 1Kb - 5Mb."
      );
    } else {
      this.dispalyfile = event.target.files[0];
      if (this.dispalyfile && this.dispalyfile.length > 0) {
        this.createPostFileLoading = true;
      } else {
        this.createPostFileLoading = false;
      }
      // this.feedContent = this.CustomDocument.getElementById("createContent").innerHTML; // because [(ngModel)]
      let fd = new FormData();
      if (this.selectedTags.length > 0) {
        this.selectedTags.forEach((element) => {
          fd.append("hashTagIds", element.hashTagId);
        });
      }
      if (this.feedContent) {
        fd.append("postDescription", this.feedContent);
      }
      if (this.selectedSpecificConnectionsDets.length > 0) {
        this.selectedSpecificConnectionsDets.forEach((element) => {
          fd.append("emails", element.email);
        });
      }
      if (this.selectedExceptConnectionsDets.length > 0) {
        this.selectedExceptConnectionsDets.forEach((element) => {
          fd.append("emails", element.email);
        });
      }
      if (this.dispalyfile) {
        fd.append("multipartFile", this.dispalyfile);
      }
      // fd.append('groupId', this.groupInfo.groupId);
      // fd.append("whoCanSee", this.whoCanSeeValue =='Specific Connections' ? 'friendsInclude' :'connections Except' ? 'friendsExclude':this.whoCanSeeValue);
      if (this.whoCanSeeValue === "groups") {
        fd.append("groupId", this.feedPostSelectGroup.id);
      }
      if (this.selectedTags.length > 0) {
        this.selectedTags.forEach((element) => {
          fd.append("hashTagIds", element.hashTagId);
        });
      }
      fd.append("status", "draft");
      this.fileSubscription = this.feed.postFeed(fd).subscribe((res) => {
        this.createPostFileLoading = false;
        dispalyfileData1 = null;
        if (res.status == "SUCCESS") {
          if (res.map.itemVo) {
            this.dispalyfileData = res.map.itemVo;
            this.dialogRef.closeAll();
            this.snack.openSnackBar("success", "File uploaded successfully.");
          } else {
            this.dispalyfileData = null;
            this.dispalyfile = null;
          }
        } else {
          this.dispalyfileData = null;
          this.dispalyfile = null;
          this.dialogRef.closeAll();
          this.snack.openSnackBar("failure", "Please upload a valid file");
        }
      });
    }
  }
  openWhoCanCommentOptions(template: TemplateRef<any>) {
    this.openWhoCanComment = true;
    this.whoCanCommentOnPostModalRef = this.modalService.show(template, {
      class: "modal-dialog-centered modal-lg",
      backdrop: "static",
    });
    this.modalService.onHidden.subscribe(res=>{
      this.openWhoCanComment = false;
    })
  }
  postFeed() {
    // this.postFeedLoader = true;
    // this.loader = true;
    this.dialogRef.open(LoaderComponent, {
      data: { type: 1, size: "" },
      panelClass: "loader-class",
      disableClose: true,
    });
    let fd = new FormData();
    if (
      this.feedContent &&
      this.CustomDocument.getElementById("createContent").innerText.trim()
    ) {
      fd.append("postDescription", this.feedContent? this.removeWhiteSpace(this.feedContent) :this.feedContent);
    }
    // fd.append('hashTagIds', []);
    if (this.image) {
      fd.append("multipartFile", this.image);
    }
    if (this.dispalyfile) {
      fd.append("multipartFile", this.dispalyfile);
    }
    if(this.componentType==='group'){
      fd.append('groupId' , this.feedPostSelectGroup?.id)
    }
    fd.append("commentsVisiblity", this.whoCanCommentValue);
    fd.append(
      "whoCanSee",
      this.whoCanSeeValue == "Specific Connections"
        ? "friendsInclude"
        : this.whoCanSeeValue == "connections Except"
        ? "friendsExclude"
        : this.whoCanSeeValue
    );
    if (this.whoCanSeeValue === "groups") {
      fd.append("groupId", this.feedPostSelectGroup.id);
    }
    if (this.videoUrl) {
      fd.append("videoLink", this.videoUrl);
    }
    if (this.videoDescription) {
      fd.append("videoDescription", this.videoDescription);
    }
    if(this.hashTagInfo?.length){
      let found = false;
      this.selectedTags.forEach(element =>{
        if(element.hashTagId === this.hashTagInfo[0]['hashTagId']){
          found = true;
        }
      });
      if(!found){
        this.selectedTags = [...this.hashTagInfo , ...this.selectedTags];
      }
    }
    if (this.selectedTags.length > 0) {
      this.selectedTags.forEach((element) => {
        fd.append("hashTagIds", element.hashTagId);
      });
    }
    if (this.selectedSpecificConnectionsDets.length > 0) {
      this.selectedSpecificConnectionsDets.forEach((element) => {
        fd.append("emails", element.email);
      });
    }
    if (this.selectedExceptConnectionsDets.length > 0) {
      this.selectedExceptConnectionsDets.forEach((element) => {
        fd.append("emails", element.email);
      });
    }

    var desc = this.CustomDocument.getElementById("createContent").innerText;
    fd.append("status", "publish");
    fd.append("descriptionLength", String(desc.length));
    if (
      !fd.has("postDescription") &&
      !fd.has("multipartFile") &&
      !fd.has("videoLink") &&
      !fd.has("videoDescription") &&
      !fd.has("hashTagIds")
    ) {
      this.dialogRef.closeAll();
      this.postFeedLoader = false;
      this.snack.openSnackBar(
        "failure",
        "Add at least one field before posting"
      );
      return;
    }

    if(this.componentType != 'company' && this.componentType != 'internship'){
      this.feed.postFeed(fd).subscribe((res) => {
        this.dialogRef.closeAll();
        if (res.status === "SUCCESS") {
          this.postFeedLoader = false;
          this.snack.openSnackBar(
            "success",
            "Your post has been created successfully"
          );
          this.onClose.emit({'feed':res});
          this.feedContent = null;
          this.dispalyfile = null;
          this.videoUrl = null;
          this.sanitVideoUrl = null;
          this.displayImage = null;
          this.image = null;
          this.videoDescription = null;
          this.dispalyfileData = null;
          this.selectedTags = [];
          if (!this.feedItems) this.feedItems = [];
          res.map.itemVo.originalVideoLink = JSON.parse(JSON.stringify(res.map.itemVo.videoLink))
          this.feedItems.unshift(res.map.itemVo);
          this.getClearData();
          this.selectedSpecificConnectionsDets = [];
          this.selectedExceptConnectionsDets = [];
        } else {
          this.postFeedLoader = false;
          this.snack.openSnackBar("info", res.message);
        }
      });
    }
    if(this.componentType === 'company'){
      fd.append("companyId", this.companyOverViewDets.companyProfile.companyId);
      this.publicPortfolio.postEmployerFeed(fd).subscribe((res) => {
        this.dialogRef.closeAll();
        if (res.status === "SUCCESS") {
          this.postFeedLoader = false;
          this.snack.openSnackBar("success", "You Successfully added a post");
          this.onClose.emit({'feed':res});
          // this.modalRef.hide();
          this.feedContent = null;
          this.dispalyfile = null;
          this.videoUrl = null;
          this.sanitVideoUrl = null;
          this.displayImage = null;
          this.image = null;
          this.videoDescription = null;
          this.dispalyfileData = null;
          // this.selectedTags = [];
          // this.companyPosts.unshift(res.map.itemVo);
          // this.showTemp(res.map.itemVo, this.shareFeedOnModal);
        } else {
          this.postFeedLoader = false;
          this.snack.openSnackBar("info", res.message);
        }
      });
    }
    if(this.componentType === 'internship'){
      this.publicPortfolio.postEmployerFeed(fd).subscribe((res) => {
        this.dialogRef.closeAll();
        if (res.status === "SUCCESS") {
          this.postFeedLoader = false;
          this.snack.openSnackBar("success", "You Successfully added a post");
          this.modalRef.hide();
          this.feedContent = null;
          this.dispalyfile = null;
          this.videoUrl = null;
          this.sanitVideoUrl = null;
          this.displayImage = null;
          this.image = null;
          this.videoDescription = null;
          this.dispalyfileData = null;
          this.selectedTags = [];
          // this.companyPosts.unshift(res.map.itemVo);
          // this.showTemp(res.map.itemVo, this.shareFeedOnModal);
        } else {
          this.postFeedLoader = false;
          this.snack.openSnackBar("info", res.message);
        }
      });
    }
    // if(this.componentType != 'internship'){
    // }
  }
  showTemp(data, template) {
    this.shareOnProfileData = data;
    this.showFeedOnProfRef = this.modalService.show(template, { class: "modal-dialog-centered model-post" });
  }
  getClearData() {
    this.connectionsSearchText = "";
    this.arrayToString = [];
    if (this.users && this.users.length !== 0) {
      this.users.forEach((element2) => {
        element2.checked = false;
      });
    }

    this.selectedData = [];

    if (this.usersListExcept && this.usersListExcept.length !== 0) {
      this.usersListExcept.forEach((element2) => {
        element2.checked = false;
      });
    }
    this.selectedDataExcept = [];
  }
  removeWhiteSpace(description){
    description = description.replace(/^(<p>\s*<br>\s*<\/p>)+|(<p>\s*<br>\s*<\/p>)+$/g, '');
     return description;
  }

  updateFeed() {
    this.postFeedLoader = true;
    let ids = [];
    if(this.hashTagInfo?.length &&this.componentType === 'hashtags'){
      let found = false;
      this.selectedTags.forEach(element =>{
        if(element.hashTagId === this.hashTagInfo[0]['hashTagId']){
          found = true;
        }
      });
      if(!found){
        this.selectedTags = [...this.hashTagInfo , ...this.selectedTags];
      }
    }
    let fd = new FormData();
    if (this.selectedTags.length > 0) {
      this.selectedTags.forEach((element) => fd.append('hashTagIds', element.hashTagId));
    }
    if (this.selectedSpecificConnectionsDets.length > 0) {
      this.selectedSpecificConnectionsDets.forEach((element) => {
        fd.append('emails', element.email)
        ;
      });
    }
    if (this.selectedExceptConnectionsDets.length > 0) {
      this.selectedExceptConnectionsDets.forEach((element) => {
        fd.append('emails', element.email)
      });
    }
    if(this.displayImage){
      this.image && fd.append('multipartFile', this.image);
    }
    if (this.sanitVideoUrl) {
      fd.append("videoLink", this.editFeed?.originalVideoLink);
    }

    if (this.whoCanSeeValue === "groups") {
      let gpd = this.editFeed.groupId;
      fd.append('groupId', gpd);
    }
    const innerText =
      this.CustomDocument.getElementById("createContent").innerText.trim();
      const feedContentfound = this.feedContent && this.removeWhiteSpace(this.feedContent);
      if(feedContentfound){
        fd.append('postDescription',this.feedContent?  feedContentfound :this.feedContent);
      }
      fd.append('feedItemId', this.editFeed.feedItemId);
      fd.append('descriptionLength', `${innerText.length}`);
      fd.append('isMultipartFileDeleted',String(!!this.ismultiPartFileDelete))
          if(!fd.has("postDescription") &&
          !fd.has("multipartFile") &&
          !fd.has("videoLink") &&
          !this.displayImage &&
          !this.dispalyfileData){
      this.postFeedLoader = false;
      this.snack.openSnackBar("failure", "Please add at least one field");
      return
    }
    this.feed
      .updateFeedItem(fd)
      .subscribe((res) => {
        if (res.status === "SUCCESS") {
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          this.currentPage = 1;
          this.postFeedLoader = false;
          this.snack.openSnackBar("success", "Post updated successfully");
          // this.feedItems[this.editFeed.presentIndex] = res.map.itemVo;
          // this.modalRef.hide();
          this.dispalyfile = null;
          this.videoUrl = null;
          this.displayImage = null;
          this.dispalyfileData = null;
          this.image = null;
          this.videoDescription = null;
          this.sanitVideoUrl = null;
          this.feedContent = null;
          this.editFeed = null;
          // this.selectedTags = [];
          // this.feedItems.unshift(res.map.itemVo);
          this.users = []
          this.selectedData = [];
          this.usersListExcept = []
          this.selectedDataExcept = [];
          res.map.itemVo.originalVideoLink = JSON.parse(JSON.stringify(res.map.itemVo.videoLink))
          this.onClose.emit({'Update_Post':res});
        } else {
          this.postFeedLoader = false;
          this.snack.openSnackBar("info", res.message);
        }
      });
  }
  getFeedold(feedType, initial?) {
    this.feedData = true;
    this.feed
      .getFeedEmail(this.currentPage, feedType)
      .pipe(
        map((res: any) => {
          if (res.map.feedItemVos) {
            res.map.feedItemVos.forEach((element) => {
              if (element.videoLink) {
                // element.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(element.videoLink);
                element.videoLink = this.snack.sanitizeyoutubeurl(
                  element.videoLink
                );
              }
              element.showCommentLimit =
                element.feedItemCommentVos.length > 4
                  ? 4
                  : element.feedItemCommentVos.length;
            });
            return res;
          }
          return res;
        })
      )
      .subscribe((res) => {
        if (res.status === "SUCCESS") {
          this.feedData = false;
          if (initial) {
            this.feedItems = this.feedItems.concat(res.map.feedItemVos);
            // this.totalPages = +res.map.paginationDTO.totalPages;
          } else {
            this.feedItems = res.map.feedItemVos;
            // this.totalPages = +res.map.paginationDTO.totalPages;
          }
          if (res.map.paginationDTO !== null) {
            this.paginationDatacame = true;
            this.totalPages = +res.map.paginationDTO.totalPages;
          }
        } else {
          this.feedData = false;
        }
        //  this.paginationDatacame = true;
        // if (initial) {
        //   this.paginationDatacame = true;
        // }
      });
  }
  sharePost() {
    this.postFeedLoader = true;
    let ids = [];
    this.shareData = null;
    if (this.selectedTags?.length > 0) {
      this.selectedTags.forEach((element) => ids.push(element.hashTagId));
    }
    let emails = [];
    if (this.selectedSpecificConnectionsDets?.length > 0) {
      this.selectedSpecificConnectionsDets.forEach((element) => {
        emails.push(element.email);
      });
    }
    if (this.selectedExceptConnectionsDets?.length > 0) {
      this.selectedExceptConnectionsDets.forEach((element) => {
        emails.push(element.email);
      });
    }
    var desc =
      this.CustomDocument.getElementById("createContent").innerText.trim();
    if (this.whoCanSeeValue === "groups") {
      this.shareData = {
        postDescription: this.feedContent?  this.removeWhiteSpace(this.feedContent) :this.feedContent,
        hashTagIds: ids,
        whoCanSee: this.whoCanSeeValue,
        commentsVisiblity: this.whoCanCommentValue,
        groupId: this.feedPostSelectGroup.id,
        descriptionLength: desc.length,
        status: "publish",
      };
    } else {
      this.shareData = {
        postDescription: this.feedContent?  this.removeWhiteSpace(this.feedContent) :this.feedContent,
        hashTagIds: ids,
        whoCanSee:
          this.whoCanSeeValue == "Specific Connections"
            ? "friendsInclude"
            : this.whoCanSeeValue == "connections Except"
            ? "friendsExclude"
            : this.whoCanSeeValue,
        emails: emails || [],
        commentsVisiblity: this.whoCanCommentValue,
        descriptionLength: desc.length,
        status: "publish",
      };
    }
    if (
      !this.feedContent &&
      this.CustomDocument.getElementById("createContent").innerText.trim()
    ) {
      this.postFeedLoader = false;
      this.snack.openSnackBar("failure", "Please add post description");
      return;
    }
    this.feed
      .sharePost(this.shareFeed.feedItemId, this.shareData)
      .subscribe((res) => {
        if (res.status === "SUCCESS") {
          this.currentPage = 1;
          this.postFeedLoader = false;
          this.snack.openSnackBar("success", "You Successfully shared a post");
          // this.modalRef.hide();
          this.dispalyfile = null;
          this.videoUrl = null;
          this.sanitVideoUrl = null;
          this.displayImage = null;
          this.image = null;
          this.videoDescription = null;
          this.feedContent = null;
          this.editFeed = null;
          this.selectedTags = [];
          this.shareData = null;
          this.shareFeed = null;
          this.onClose.emit({'shareFeed':res});
        } else {
          this.postFeedLoader = false;
          this.snack.openSnackBar("info", res.message);
        }
      });
  }
  savedCommentgroupValue() {
    this.whoCanCommentstyle = this.whoCanCommentValue;
  }
  savedCommentValue(data: any) {
    this.whoCanCommentValue = data;
  }
  hidePopups() {
    this.feedContent = null;
    this.dispalyfile = null;
    this.selectedTags = [];
    this.videoUrl = null;
    this.sanitVideoUrl = null;
    this.displayImage = null;
    this.image = null;
    this.editFeed = null;
    this.shareData = null;
    this.shareFeed = null;
    this.videoDescription = null;
    this.dispalyfileData = null;
    this.getClearData();
    this.selectedSpecificConnectionsDets = [];
    this.selectedExceptConnectionsDets = [];
    this.postFeedLoader = false;
    this.discardModalRef.hide();
    this.onClose.emit('Create_Post_Component_Closed');
    if (this.fileSubscription) {
      this.fileSubscription.unsubscribe();
    }
  }
  toggleHashTag(){
    this.displayTags = !this.displayTags;
  }
  hideConnectionExcept() {
    this.ConnectioGroupTemplate.hide();
    this.usersListExcept.forEach((el) => {
      el.checked = false;
    });
    this.selectedDataExcept = [];
    this.connectionsSearchText = "";
  }
  addItem(item) {
    if(item.hashTagName.length < 2 && item.hashTagName.length > 231){
     this.snack.openSnackBar('failure', "Hashtag must be between 1 and 230 characters.");
      return;
    } 
    const formattedHashtag = item.hashTagName.replace(/[^a-zA-Z0-9_]/g, '');
    if (!formattedHashtag) {
      console.error('Invalid hashtag:', formattedHashtag);
      this.snack.openSnackBar('failure', "Invalid hashtag");
       this.clearAllHashtag();
      return;
    }

    this.duplicatehashtag = this.selectedTags.filter((x) => {
      if(x.hashTagName == formattedHashtag){
        return;
      }
  });

  console.log(formattedHashtag.length,"hashtag length")
    if (!item.hashTagId) {
      this.feed
        .createHashTag({
          hashTagName: "#"+formattedHashtag,
        })
        .subscribe((res) => {
          if (res.status === "SUCCESS") {
            this.tagSuggetions.push(res.map.neo4jHashTagVO);
            this.selectedTags = this.selectedTags.filter(
              (x) => x.hashTagName !== item.hashTagName
            );
            this.selectedTags.push(res.map.neo4jHashTagVO);
            this.getHashTagSuggetions("a");
          }
          //  "status": "INVALID" "message": "The HashTag Length Must be Beetween 1 and 230 characters"
          else if(res.status == 'INVALID'){
            this.snack.openSnackBar('failure', res!.message);
            this.clearAllHashtag();
            return;
          }
           else {
            if(res?.errorMessages[0]['field'] == 'Exception Message'){
              this.snack.openSnackBar('failure', "This hashtag Already Existed");
           }
          }
        });
    } else {
      let obj = {
        hashTagId: item["hashTagId"],
        hashTagName:item['hashTagName']
      };
      this.selectedTags.push(obj);
    }
  }


  clearAllHashtag() {
    this.selectedTags = [];
  }
  getHashTagSuggetions(text): void {
    // const i = text?.lastIndexOf("#");
    // const search = text.slice(i + 1);
    const search = text.replace(/[^a-zA-Z0-9_]/g, '');
    if (search == '') {
        // Handle the case when no search term is provided (initial load or cleared input)
        this.tagSuggetions = []; // Clear existing suggestions
        return;
    }
    this.conns.getHashTagSuggetions(this.currentPage, search).subscribe((res) => {
        if (res.status === "SUCCESS") {
            this.tagSuggetions = res.map.hashTags || [];
            this.isenable = this.tagSuggetions.length > 0;
        }else {
          this.tagSuggetions = []; // Clear suggestions on failure or no data
      }
    });
}

  onRemoveHashTag(event) {
    let removedHashTag = event.value["hashTagId"];
    let index = this.selectedTags.findIndex(hashtags => hashtags["hashTagId"] === removedHashTag);
    this.selectedTags.splice(index, 1);
  }
  openShareDocument(template: TemplateRef<any>) {
    // this.modalRef.hide();
    this.videoModalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "modal-dialog-centered" })
    );
  }
  uploadVideoFile() {
    this.sanitVideoUrl = this.sanitizeyoutubeurl(this.videoUrl);
  }
  sanitizeyoutubeurl(url) {
    const videoid = url.match(
      /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)\/(?:watch\?v=|shorts\/|embed\/|)([^\s&?/]+)/
    );
    if (videoid) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoid[1]}`
      );
    } else {
      this.sanitVideoUrl = null;
      this.videoUrl = null;
      this.videoDescription = null;
      this.snack.openSnackBar("failure", "Please upload a valid video URL");
    }
  }
  checkPostDescriptionLength(postDescription) {

    const html = this.CustomDocument.createElement('p');    
    html.innerHTML = postDescription;
    const txtCntLen = html.textContent.length;
    if(txtCntLen>400) {
      return true;
    } else {
      return false;
    }
  }
  quillConfig: QuillModules = {
    toolbar: false,
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,

      mentionDenotationChars: ["@", "#"],
      // selectKeys:[13,32],
      mentionListClass: "ql-mention-list mat-elevation-z8",
      source: (searchTerm: any, renderList: any, mentionChar: any) => {
        if (mentionChar == "#") {
          if (searchTerm) {
            let whiteSpaceInString: number = 0;
            searchTerm.split("").forEach((element) => {
              element === " " ? whiteSpaceInString++ : "";
            });
            if (whiteSpaceInString <= 1 && !searchTerm.split(" ")[1]) {
              this.conns
                .getHashTagSuggetions(this.currentPage, searchTerm)
                .subscribe((res) => {
                  if (res.status == "SUCCESS") {
                    this.tagSuggetions = res.map.hashTags || [];
                    if (
                      this.tagSuggetions.length == 0 &&
                      whiteSpaceInString === 1 &&
                      !searchTerm.split(" ")[1]
                    ) {
                      this.feed
                        .createHashTag({
                          hashTagName: "#"+searchTerm.trim(),
                        })
                        .subscribe((res) => {
                          if (res.status === "SUCCESS") {
                            this.tagSuggetions.push(res.map.neo4jHashTagVO);
                            this.atValues = [];
                            this.atValues = this.tagSuggetions.map((hash) => {
                              return {
                                id: hash.hashTagId,
                                value:(hash.hashTagName),
                                link:
                                  "/mynetwork/hashtag-profile/" +
                                  this.removeHash(hash.hashTagName),
                              };
                            });

                            if (searchTerm.length === 0) {
                              renderList(this.atValues, searchTerm);
                            } else {
                              renderList(this.atValues, searchTerm);
                            }
                          }
                        });
                    } else {
                      this.atValues = [];
                      this.atValues = this.tagSuggetions.map((hash) => {
                        return {
                          id: hash.hashTagId,
                          value: hash.hashTagName,
                          link: "/mynetwork/hashtag-profile/" +this.removeHash(hash.hashTagName),
                        };
                      });

                      if (searchTerm.length === 0) {
                        renderList(this.atValues, searchTerm);
                      } else {
                        renderList(this.atValues, searchTerm);
                      }
                    }
                  }
                });
            } else {
              this.atValues = [];
              renderList(this.atValues, searchTerm);
            }
          }
        } else {
          this.conns.getAllUsersandCompanies(searchTerm).subscribe((res) => {
            if (res.status == "SUCCESS") {
              this.atValues = [];
              this.atValues = res.map.fields.map((company) => {
                return {
                  id: company.id,
                  value: company.fullName,
                  link: company.routerLink,
                };
              });

              if (searchTerm.length === 0) {
                renderList(this.atValues, searchTerm);
              } else {
                renderList(this.atValues, searchTerm);
              }
            }
          });
        }
      },
      onSelect: (item, insertItem) => {
        item.value = item.value.replace('<a', `<a mention`);
        insertItem(item);
      },
      linkTarget:'_blank',
    },
    magicUrl: true,
  };
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  hideGroupsTemplate() {
    this.getClearData();
    this.userGroupsModalRef.hide();
    this.whoCanSeePostModalRef.hide();
  }
  removeHash(hashtagName){
    if(hashtagName[0]=='#'){
      hashtagName = hashtagName.slice(1);
      if(hashtagName[0]=='#'){
        this.removeHash(hashtagName)
      }
    }
    return hashtagName||'%20';
  }
  shareFeedItem(template){
    this.whoCanSeeValue = 'anyone';
    this.whoCanCommentValue = this.shareOnProfileData.commentsVisiblity || 'anyone';
    this.sharedFeedTags = this.shareOnProfileData.neo4jHashTagVOs || [];
    if (this.sharedFeedTags.length > 0) {
      this.displayTags = true;
    }
    this.sharedSanitVideoUrl = this.shareOnProfileData.videoLink;
    this.shareFeed = this.shareOnProfileData || null;
    this.showFeedOnProfRef.onHide.emit("value is true")
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: "modal-dialog-centered" }));
  }
  
}
