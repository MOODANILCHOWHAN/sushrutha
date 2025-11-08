// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-my-post-and-activity',
//   templateUrl: './my-post-and-activity.component.html',
//   styleUrl: './my-post-and-activity.component.css'
// })
// export class MyPostANdActivityComponent {

// }

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageConnectionsService } from'../../../../jobseeker/providers/manage-connections.service';
import { ShowerrorsService } from'../../../../shared/providers/showerrors.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { debounce, debounceTime, map } from 'rxjs/operators';
import { Subscription, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from "../../../../core/modals/loader/loader.component";
import { HttpClient } from '@angular/common/http';
import { Config } from 'protractor';
import { LocationserviceService } from'../../../../core/providers/locationservice.service';
import { environment } from '../../../../../environments/environment';
import { NotificationsallService } from'../../../../providers/notifications.service';
import { DOCUMENT } from "@angular/common";
import { FeedService } from'../../../../jobseeker/providers/feed.service';
import { QuillEditorComponent } from 'ngx-quill'

import * as QuillNamespace from 'quill';
import QuillMention from 'quill-mention';

const Quill: any = QuillNamespace;
Quill.register({ "modules/mention": QuillMention }, true);

@Component({
  selector: 'my-posts-activity',
  templateUrl: './my-posts-activity.component.html',
  styleUrls: ['./my-posts-activity.component.scss']
})
export class MyPostsActivityComponent implements OnInit {
  
  @ViewChild(QuillEditorComponent, { static: true })editor: QuillEditorComponent;
  dilogcoun: any;
  jobs: any;
  companies: any;
  internships: any;
  nofeeds:boolean=false;
  loggedUser;
  currentPage = 1;
  totalPages;
  paginationDatacame = false;
  activityPosts;
  allPosts;
  loggedUserDetails = {};
  activitiesTab = true;
  subscription: Subscription;

  editFeedModalRef: BsModalRef;
  discardModalRef: BsModalRef;
  whoCanCommentOnPostModalRef: BsModalRef;
  whoCanSeePostModalRef: BsModalRef;
  userGroupsModalRef: BsModalRef;
  editFeed;
  shareFeed;
  shareData;
  feedContent;
  dispalyfile;
  videoUrl;
  sanitVideoUrl;
  displayImage;
  dispalyfileData;
  image;
  videoDescription;
  whoCanSeeValue = "anyone";
  whoCanCommentValue = "anyone";
  feedPostSelectGroup = { id: null, name: null, logoPath: null };
  selectedTags = [];
  tagSuggetions = [];
  displayTags: Boolean = false;
  groupSearchText = '';
  searchGroupPage = 1;
  searchGroupPageLast;
  searchGroupPageTotalRecords;
  userGroups;
  sharedFeedTags = [];
  sharedSanitVideoUrl;
  currentTab = 'posted'
  feedItems = [];
  isPostDataCame: boolean = false;
  feedIndex: any;
  ismultiPartFileDelete: any;
  constructor(public conns: ManageConnectionsService,
    public notifications: NotificationsallService,
    private route: ActivatedRoute,
    private locser: LocationserviceService,
    public http: HttpClient,
    private router: Router,
    public snack: ShowerrorsService,
    public dialog: MatDialog,
    private modalService: BsModalService,
    private feedService: FeedService,
    @Inject(DOCUMENT) private CustomDocument: Document,
  ) { }

  ngOnInit() {
    window.scrollTo(0,0);
    window.addEventListener("scroll", this.scroll, true);
    // this.getActivityPosts(false);
    this.getPosts('posted',false);
    this.getTrendingJobs();
    this.getHiringCompanies();
    this.getPopularInternships();
  }
  
  getActivityPosts(pagination?) {
    this.dilogcoun = this.dialog.open(LoaderComponent, {
      data: { type: 1, size: "" },
      panelClass: "loader-class",
      disableClose: true,
    });
    this.subscription = this.conns.getActivityandPosts(this.currentPage)
    .pipe(
      map((res: any) => {
        if (res.map?.userActivities?.feedItems) {
          res.map.userActivities.feedItems.forEach((element) => {
            if (element.videoLink) {
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
    ).subscribe((res) => {
      if(res.status === 'SUCCESS') {
        if (pagination) {
          this.activityPosts.concat(res.map.userActivities);
        } else {
          this.activityPosts = res.map.userActivities;
        }
        this.loggedUserDetails['fullName'] = res.map.userActivities.fullName;
        this.loggedUserDetails['portfolioUserId'] = res.map.userActivities.portfolioUserId;
        this.loggedUserDetails['designation'] = res.map.userActivities.designation;
        // console.log('this.loggedUserDetails', this.loggedUserDetails);
        sessionStorage.setItem('loggedUserDetails', JSON.stringify(this.loggedUserDetails));
        this.paginationDatacame = true;
        this.dilogcoun.close();
      }else {
        this.dilogcoun.close();
      }
    });
  }
  stop:boolean=true;
  scroll = (event): void => {
    let pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    const feedContainer = document.getElementById('mobileResponsive');
    if (pos === max && this.allPosts.feedItems && window.innerWidth > 500) {
      this.getPosts(this.currentTab, true);
      // this.nofeeds = true;
      // if (this.totalPages && this.totalPages>= this.currentPage && !this.isPostDataCame) {
      //   // this.paginationDatacame = false;
      //   this.isPostDataCame = false;
      //  // this.nofeeds = true;
      //   this.currentPage = this.currentPage + 1;
      //   this.getPosts(this.currentTab,true);
      // }
    }
    if(pos+feedContainer.offsetHeight >= max -60 && pos+feedContainer.offsetHeight <= max && window.innerWidth<500 && this.allPosts.feedItems && this.stop){
      console.log('-------------matched');
       this.getPosts(this.currentTab, true);
    }
  }

  getPosts(postType,initial?,actionType?) {
    this.isPostDataCame = false;
    this.stop=false;
    console.log(this.currentPage,'currentPage')
    this.subscription = this.conns.getMyPosts(postType,this.currentPage)
    .pipe(
      debounceTime(1000),
      map((res: any) => {
        if (res.map?.userActivities.feedItems) {
          res.map.userActivities.feedItems.forEach((element) => {
            if (element.videoLink) {
              element.originalVideoLink = JSON.parse(JSON.stringify( element.videoLink))
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
    ).subscribe((res) => { 
     this.stop=true;
      this.isPostDataCame = true;
      if(res.status === 'SUCCESS') {
        this.allPosts = (res.map.userActivities);
          this.currentPage++
        if (initial) {
          // this.allPosts.concat(res.map.userActivities);
         
          if(res.map.userActivities.feedItems === null || res.map.userActivities.feedItems.length<9){
            this.nofeeds = true;
          }
          
          this.feedItems = [...this.feedItems,...res.map.userActivities.feedItems];
        } else {
          // this.allPosts = (res.map.userActivities);
          this.feedItems = [...res.map.userActivities?.feedItems];
        }
        this.paginationDatacame = true;
      }
    })
  }

  refreshFeed(actionType?) {
    // this.getActivityPosts(false);
    this.getPosts(this.currentTab,false,actionType);
  }
  
  spliceFeedItem(remIndex) {
    this.feedItems.splice(remIndex,1);
    this.refreshFeed('delete');
  }

  getHashTagSuggetions(text): void {
    this.conns.getHashTagSuggetions(this.currentPage, text).subscribe((res) => {
      if (res.status == "SUCCESS") {
        this.tagSuggetions = res.map.hashTags || [];
      }
    });
  }

  loadHashtagProfile(hashTagName) {
    this.editFeedModalRef.hide();
    this.router.navigate(["/mynetwork/hashtag-profile/"+this.removeHash(hashTagName)]);
  }

  removeHash(hashtagName){
    if(hashtagName[0]=='#'){
      hashtagName = hashtagName.slice(1);
      if(hashtagName[0]=='#'){
        this.removeHash(hashtagName)
      }
    }
    return hashtagName;
  }

  addItem(item) {
    // console.log(item);
    if(item.hashTagName.includes('#')){
      let data =item.hashTagName.split('#');
      item.hashTagName =data[1];
    }
    if (!item.hashTagId) {
      this.feedService
        .createHashTag({
          hashTagName: "#" + item.hashTagName,
        })
        .subscribe((res) => {
          if (res.status === "SUCCESS") {
            this.tagSuggetions.push(res.map.neo4jHashTagVO);
            this.selectedTags = this.selectedTags.filter((x) => x.hashTagName !== item.hashTagName);
            this.selectedTags.push(res.map.neo4jHashTagVO);
          }
          else if (res.status === "EXCEPTION" && res?.errorMessages[0]?.message.includes('Already Exists')) {
            const hashTagId = Number(res?.errorMessages[0]?.message?.split('id=')[1]);
            const hashTagName = res?.errorMessages[0]?.message?.split('HashTag ')[1].split(' ')[0];
            const existingHashTag = {followersCount:0,hashTagId:hashTagId,hashTagName:hashTagName}
            this.selectedTags = this.selectedTags.filter((x) => x.hashTagName !== item.hashTagName);
            this.selectedTags.push(existingHashTag);
          }
        });
    }else{
      let obj ={
        hashTagId:item['hashTagId']
      }
      this.selectedTags.push(obj);
    }
  }

  editFeedItem(data, template: TemplateRef<any>,index) {
    this.feedIndex = index;
    var feed = data.feed;
    this.feedContent = feed.postDescription;
    this.whoCanSeeValue = feed.whoCanSee;
    this.whoCanCommentValue = feed.commentsVisiblity;
    this.feedPostSelectGroup ={
      id : feed.groupId,
      name:feed.groupName,
      logoPath:null
    };
    this.selectedTags = feed.neo4jHashTagVOs || [];
    if (data.feed.fileType && data.feed.fileType == "file") {
      this.dispalyfileData = data.feed;
    } else if (data.feed.fileType == "Image") {
      this.displayImage = this.snack.getJsImage(
        data.feed.encodedFilePath,
        null
      );
    }
    if(feed?.videoLink){
      this.videoUrl = feed?.videoLink;
      this.sanitVideoUrl = feed?.videoLink;
      this.videoDescription = feed.videoDescription
    }
    if (this.selectedTags.length > 0) {
      this.displayTags = true;
    }
    this.editFeed = feed;
    this.editFeedModalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "modal-dialog-centered" })
    );
  }

  updateFeed() {
    let fd = new FormData();
    let uniqueTags = new Set();
    if (this.selectedTags.length > 0) {
      this.selectedTags.forEach((element) =>uniqueTags.add(element.hashTagId));
      uniqueTags.forEach((element) => {
        fd.append("hashTagIds", String(element));
      });
    }
    // this.feedContent = this.CustomDocument.getElementById(
    //   "createContent"
    // ).innerHTML;
    if (this.editFeed?.videoLink) {
      fd.append("videoLink", this.editFeed.originalVideoLink);
    }
    var gpd;
    if (this.whoCanSeeValue === "groups") {
      fd.append('groupId',this.feedPostSelectGroup.id)
    }
    if(this.feedContent){
      fd.append('postDescription',this.feedContent)
    }
    fd.append('feedItemId',this.editFeed.feedItemId)
    fd.append('whoCanSee',this.whoCanSeeValue)
    if(this.displayImage){
      this.image && fd.append('multipartFile', this.image);
    }
    fd.append('isMultipartFileDeleted',String(!!this.ismultiPartFileDelete))

    this.feedService
      .updateFeedItem(fd)
      .subscribe((res) => {
        if (res.status === "SUCCESS") {
          this.snack.openSnackBar("success", "Post updated successfully");
          this.editFeedModalRef.hide();
          this.dispalyfile = null;
          this.videoUrl = null;
          this.displayImage = null;
          this.image = null;
          this.videoDescription = null;
          this.feedContent = null;
          this.editFeed = null;
          this.selectedTags = [];
          // if(this.currentTab === 'posted'){
          //   this.insertItem(this.feedIndex,res?.map?.itemVo,'edit')
          // }
          this.feedItems[this.feedIndex] = res?.map?.itemVo;
          if(res?.map?.itemVo?.videoLink){
            this.feedItems[this.feedIndex].originalVideoLink = JSON.parse(JSON.stringify(res.map.itemVo.videoLink))
          }
          // this.activityPosts.feedItems.unshift(res.map.itemVo);
        } else {
          this.snack.openSnackBar("info", res.message);
        }
      });
  }

  shareFeedItem(data, template,index) {
    this.feedIndex = index;
    this.whoCanSeeValue = 'anyone';
    this.whoCanCommentValue = data.feed.commentsVisiblity;
    this.feedPostSelectGroup.id = data.feed.groupId;
    this.sharedFeedTags = data.feed.neo4jHashTagVOs || [];
    if (this.sharedFeedTags.length > 0) {
      this.displayTags = true;
    }
    this.sharedSanitVideoUrl = data.feed.videoLink;
    this.shareFeed = data.feed;
    // console.log("Share Feed Data", this.shareFeed);
    this.editFeedModalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "modal-dialog-centered" })
    );
  }

  sharePost() {
    let ids = [];
    this.shareData = null;
    if (this.selectedTags.length > 0) {
      this.selectedTags.forEach((element) => ids.push(element.hashTagId));
    }
    // this.feedContent = this.CustomDocument.getElementById(
    //   "createContent"
    // ).innerHTML;
    if (this.whoCanSeeValue === "groups") {
      this.shareData = {
        postDescription: this.feedContent ?? undefined,
        hashTagIds: ids,
        whoCanSee: this.whoCanSeeValue,
        commentsVisiblity: this.whoCanCommentValue,
        groupId: this.feedPostSelectGroup.id,
        status: "publish",
      };
    } else {
      this.shareData = {
        postDescription: this.feedContent ?? undefined,
        hashTagIds: ids,
        whoCanSee: this.whoCanSeeValue,
        commentsVisiblity: this.whoCanCommentValue,
        status: "publish",
      };
    }
    this.feedService
      .sharePost(this.shareFeed.feedItemId, this.shareData)
      .subscribe((res) => {
        if (res.status === "SUCCESS") {
          this.snack.openSnackBar("success", "You Successfully shared a post");
          this.editFeedModalRef.hide();
          this.dispalyfile = null;
          this.videoUrl = null;
          this.displayImage = null;
          this.image = null;
          this.videoDescription = null;
          this.feedContent = null;
          this.editFeed = null;
          this.selectedTags = [];
          this.shareData = null;
          this.shareFeed = null;
          if(this.currentTab==='posted'){
            if(res?.map?.itemVo?.sharedFeedOn?.videoLink){
              res.map.itemVo.sharedFeedOn.videoLink = this.snack.sanitizeyoutubeurl(
                res.map.itemVo.sharedFeedOn.videoLink
              );
              console.log("res sharedfeedon",res.map.itemVo.sharedFeedOn)
            }
            this.insertItem(0,res.map.itemVo,'shared');
          }
        } else {
          this.snack.openSnackBar("info", res.message);
        }
      });
  }

  discardPost(template: TemplateRef<any>) {
    this.discardModalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "confirmDiscard modal-sm" })
    );
  }
  insertItem(index,item,actionType){
    const c = item;
    if(actionType==='shared'){
    //  let b = JSON.parse(JSON.stringify(this.feedItems[this.feedIndex]))
      this.feedItems.unshift(c);
      // this.feedItems[0].sharedFeedOn = b;
      this.feedItems[0].sharedCount = 0;
      this.feedItems[this.feedIndex+1].sharedCount+=1;
    }else{
      for(let i = index; i>=0;i--){
        if(i===0){
          c.sharedCount = 0;
          this.feedItems[0]=c;
          return
        }
        this.feedItems[i] = this.feedItems[i-1]
      }
    }
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
    this.discardModalRef.hide();
    this.editFeedModalRef.hide();
  }

  openWhoCanCommentOptions(template: TemplateRef<any>){
    this.whoCanCommentOnPostModalRef = this.modalService.show(template, {
      class: "modal-dialog-centered",
    });
  }

  whoCanSeePostModel(template: TemplateRef<any>) {
    this.whoCanSeePostModalRef = this.modalService.show(template, {
      class: "modal-dialog-centered",
    });
  }

  userGroupsModel(template: TemplateRef<any>) {
    this.getMemberGroupsList(true);
    this.userGroupsModalRef = this.modalService.show(template, {
      class: "modal-dialog-centered",
    });
  }
  
  getMemberGroupsList(initial?) {
    // this.currentPage = 1
    this.conns.getSearchMemberGroups(this.searchGroupPage, this.groupSearchText).subscribe(res => {
      if (res.status === 'SUCCESS') {
        if(initial) {
          this.userGroups = res.map.neo4jGroupDTOs || [];
        } else {
          this.userGroups = this.userGroups.concat(res.map.neo4jGroupDTOs || []);
        }
        // console.log('Groups List', this.userGroups);
        this.searchGroupPageLast = res.map.paginationDTO.last || true;
        this.searchGroupPageTotalRecords = res.map.paginationDTO.totalRecords;
      }
    });
  }


  //Right Section
  getTrendingJobs() {
    this.http.get<Config>(`${environment.JS_API}/jobseeker/dashboard/getTrendingJobs/${this.locser.loc}`)
    .subscribe(res => {
      if(res.status == 'SUCCESS') {
        this.jobs = res.map.trendingJobs || [];
      }
    });
 }

 getHiringCompanies() {
   this.http.get<Config>(`${environment.JS_API}/jobseeker/dashboard/getHiringCompanies?pageType=company&countryCode=${this.locser.loc}`)
   .subscribe(res => {
      if(res.status == 'CATEGORY_WISE_COMPANIES') {
      this.companies = res.map.categoryWiseCompanies[0].companiesDisplayVOs || [];
      }
    });
 }

 getPopularInternships() {
   this.http.get<Config>(`${environment.JS_API}/jobseeker/dashboard/getHiringInternships?pageType=internship&countryCode=${this.locser.loc}`)
        .subscribe(res => {
          if(res.status == 'CATEGORY_WISE_INTERNSHIPS') {
            this.internships = res.map.categoryWiseInternshipCompanies[0].internshipProgramVos || []
          }
        });
  
 }
 navigateToInternship(internship) {
  this.router.navigate([`/internship-overview/${internship.companyInternshipProgramName}-overview-${internship.internshipUniqueId}`]);
}
navigateToJob(job) {
  this.router.navigate(['/jobview'], {
    queryParams: {
      id: job.linkEncodedJobId,
      postedby: job.linkPostedBy,
      jtype: job.postedBy,
      countryType: job.country
    }
  });
}

navigateToCompany(company) {
  this.router.navigate([`/overview/working-at-${company.companyName}-${company.companyUniqueId}`]);
}
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  // ngAfterViewInit(): void {
  //   if(this.snack.isBrowser()){
  //     setTimeout(() => { 
  //       this.snack.loadExternalScript("https://cdn.jsdelivr.net/npm/quill-mentions@0.2.4/dist/quill-mentions.js").then((a) => { }).catch((e) => { });
  //     }, 2000);
  //   }
  // }

  
atValues = [];
hashValues = []

quillConfig = {
  toolbar:false,
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    // mentionDenotationChars: ["@", "#"],
    mentionDenotationChars: ["@"],
    mentionListClass: "ql-mention-list mat-elevation-z8",
    source: (searchTerm:any, renderList:any, mentionChar:any) => {

      this.conns.getAllUsersandCompanies(searchTerm).subscribe(res => {
        if (res.status == "SUCCESS") {
          this.atValues =  []
          this.atValues = res.map.fields.map(company =>  { 
            return { 
              id:company.companyUniqueId,
              value:company.fullName,
              link:company.routerLink }
          })

          // if (mentionChar === "@") {
          //   const values = this.atValues || [];
          // } else {
          //   values = this.hashValues || [];
          // }
          
          if (searchTerm.length === 0) {
            renderList(this.atValues, searchTerm);
          } else {
            renderList(this.atValues, searchTerm);
          }


        }
      });



    },
    onSelect: (item, insertItem) => {
      item.value = item.value.replace('<a', `<a mention`);
      insertItem(item);
    },
    linkTarget:'_blank',
  },
  }
}