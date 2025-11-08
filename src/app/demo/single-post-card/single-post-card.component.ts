// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-single-post-card',
//   templateUrl: './single-post-card.component.html',
//   styleUrl: './single-post-card.component.css'
// })
// export class SinglePostCardComponent {

// }


import { Component, OnInit, TemplateRef, EventEmitter, OnChanges, Input, Output, ViewChildren, QueryList, HostListener, ViewChild, Inject, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageConnectionsService } from '../../../../app/jobseeker/providers/manage-connections.service';
import { ShowerrorsService } from '../../../../app/shared/providers/showerrors.service';
import { NotificationsallService } from '../../../../app/providers/notifications.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { FeedService } from '../../../../app/jobseeker/providers/feed.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportFeedComponent } from '../../../../app/jobseeker/modals/report-feed/report-feed.component';
import { saveAs } from 'file-saver';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState, userState } from '../../../core/store/app.state';
import { KeycloakAuthenticationService } from '../../../providers/keycloak-authentication.service';
import { JsProfileService } from '../../../../app/jobseeker/providers/js-profile.service';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'single-post-card',
  templateUrl: './single-post-card.component.html',
  styleUrls: ['./single-post-card.component.scss']
})
export class SinglePostCardComponent implements OnInit, OnChanges {
  @Input() feedItem:any = {};
  @Input() activityFeedItem:any = {};
  @Input() activity:boolean;
  @Input() savedFeeds:boolean;
  @Input() companyFeeds:boolean;
  @Input() selectedTagId:any = '';
  @Input() presentFeedIndex:any;
  @Output() unsaveFeedItemData: EventEmitter<any> = new EventEmitter();
  @Output() feedChanged: EventEmitter<any> = new EventEmitter();
  @Output() deleteTheFeed: EventEmitter<any> = new EventEmitter();
  @Output() editTheFeed: EventEmitter<any> = new EventEmitter();
  @Output() shareTheFeed: EventEmitter<any> = new EventEmitter();
  feed:any = {};
  comment:any = {};
  tagsUsed=[];
  sharedFeedTags: any;

  modalRef: BsModalRef;
  discardModalRef: BsModalRef;
  delFeedModalRef: BsModalRef;
  delComModalRef: BsModalRef;
  delRepModalRef: BsModalRef;
  whoCanSeePostModalRef: BsModalRef;
  userGroupsModalRef: BsModalRef;
  showWholikedModalRef: BsModalRef;
  whoCanCommentOnPostModalRef: BsModalRef;
  showMore = false;
  shareFeedShowMore = false;
  postActivityMembers=[];
  isSharedList: Boolean = false;
  isCommentLikedList: Boolean = false;
  isLastTextInModal: Boolean = false;
  //feedItems = [];
  tagsSuggetions = [];
  currentPage = 1;
  totalPages;
  feedPage = 1;
  feedsLimit;
  image;
  videoLink;
  displayImage;
  dispalyfile;
  videoUrl;
  videoDescription;
  feedContent;
  deletecomment;
  disableComment = true;
  currentLikesPage = 1;
  loaderInPostActivityModal = false;
  displayTags: Boolean = false;
  selectedTags = [];
  videoModalRef: BsModalRef;
  tagSuggetions = [];
  paginationDatacame = false;
  editFeed;
  whoCanSeeValue = 'anyone';
  whoCanCommentValue;
  userGroups;
  feedPostSelectGroup = {id: null, name:null};
  loggedUserDets = {};
  isdeletedfeed:boolean=false;
  userdata:any;

  @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;

  isUserAdminInInternshipPage: string;
  isFeedComponent: boolean;
  presentCompany: string;
  presentInternship: any;
  constructor(
    public snack: ShowerrorsService,
    private feedService: FeedService,
    private router: Router,
    private route: ActivatedRoute,
    private conns: ManageConnectionsService,
    private modalService: BsModalService,
    public notifications: NotificationsallService,
    public dialog: MatDialog,
    public jps: JsProfileService,
    @Inject(DOCUMENT) private document: Document,
    public store: Store<AppState>,
    private keyauth: KeycloakAuthenticationService,
    private el: ElementRef
    ) { }

  attachClickEvenToMentioned(editor) {
    const anchorTags = editor.querySelectorAll('a');
    if (anchorTags && anchorTags.length > 0) {
      anchorTags.forEach((anchor: HTMLAnchorElement) => {

        const isMention = anchor.hasAttribute('mention');
        if (isMention) {
          anchor.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior
            const href = anchor.getAttribute('href'); // Get the href attribute
            if (href) {
              this.router.navigate([href]); // Navigate to the specified route
            }
          });
        }
      });
    }
  }

    onEditorChanged(e) {
      if (e && e.editor && e.editor.container) {
        this.attachClickEvenToMentioned(e.editor.container);
      }
    }

    onEditorCreated(e) {
      if (e && e.container) {
        this.attachClickEvenToMentioned(e.container);
      }
    }

  ngOnInit() {
    this.store.select(userState).subscribe(res => {
      this.userdata = res;
      });
      
    this.isFeedComponent = this.router.url.includes("feed") || this.router.url.includes("mynetwork/hashtag-profile") ||  this.router.url.includes("mynetwork/my-posts-activity") ||  this.router.url.includes("groups/group-details")  ;
    if(this.router.url.includes("internship-posts")){
      this.jps.changeInternshipView.subscribe(res =>{
        this.isUserAdminInInternshipPage = res;
        this.presentInternship = JSON.parse(sessionStorage.getItem('selectedInternshipDetails'));
      })
    }else if(this.router.url.includes("posts")){
      this.jps.changeCompanyView.subscribe(res =>{
        this.isUserAdminInInternshipPage = res;
        this.presentCompany = JSON?.parse(sessionStorage.getItem('selectedCompanyDetails'));
      })
    }
  }
  ngOnChanges() {
    if(this.activity){
      if(this.activityFeedItem !== null && Object.keys(this.activityFeedItem).length > 0) {
        this.loggedUserDets['portfolioUserId'] = JSON.parse(sessionStorage.getItem('loggedUserDetails'))['portfolioUserId'];
        this.loggedUserDets['fullName'] = JSON.parse(sessionStorage.getItem('loggedUserDetails'))['fullName'];
        this.feed = this.activityFeedItem;
        console.log(this.feed,'feed')
        if(this.feed.neo4jHashTagVOs && this.feed.neo4jHashTagVOs.length > 0) {
          this.tagsUsed = this.feed.neo4jHashTagVOs;
        }

         if (this.feed && this.feed.videoLink && !this.feed.videoLink.changingThisBreaksApplicationSecurity) {
           // element.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(element.videoLink);
           this.feed.videoLink = this.snack.sanitizeyoutubeurl(this.feed.videoLink);
         }
        if(this.feed !==null && Object.keys(this.feed).length > 0){
          if (this.feed.activityType === 'COMMENT_OWNER_REPLY') {
            this.feed.openComment = true;
            this.feed['feedItemCommentVos'][0].openReplies = true;
          } else if (this.feed.activityType === 'COMMENT_OWNER') {
            this.feed.openComment = true;
          } else if (this.feed.activityType === 'COMMENT_LIKED') {
            this.feed.openComment = true;
          } else if (this.feed.activityType === 'COMMENT_LIKED_REPLY') {
            this.feed.openComment = true;
            this.feed['feedItemCommentVos'][0].openReplies = true;
          }
        }

        if(this.feed.sharedFeedOn && this.feed.sharedFeedOn.neo4jHashTagVOs && this.feed.sharedFeedOn.neo4jHashTagVOs.length > 0) {
          this.sharedFeedTags = this.feed.sharedFeedOn.neo4jHashTagVOs;
        }
      }
    } else {
      this.feed = this.feedItem;
      if(this.feed.neo4jHashTagVOs && this.feed.neo4jHashTagVOs.length > 0) {
        this.tagsUsed = this.feed.neo4jHashTagVOs;
      }

       if (this.feed && this.feed.videoLink && !this.feed.videoLink.changingThisBreaksApplicationSecurity) {
         // element.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(element.videoLink);
         this.feed.videoLink = this.snack.sanitizeyoutubeurl(this.feed.videoLink);
       }
      this.feed.editComment = false;
      if(this.feed.sharedFeedOn && this.feed.sharedFeedOn.neo4jHashTagVOs && this.feed.sharedFeedOn.neo4jHashTagVOs.length > 0) {
        this.sharedFeedTags = this.feed.sharedFeedOn.neo4jHashTagVOs;
      }
       if (this.feed.sharedFeedOn && this.feed.sharedFeedOn.videoLink && !this.feed.sharedFeedOn.videoLink.changingThisBreaksApplicationSecurity) {
         this.feed.sharedFeedOn.videoLink = this.snack.sanitizeyoutubeurl(this.feed.sharedFeedOn.videoLink);
       }

        // if (this.feed.jobTitleFeed && this.feed.userType !== 'OWNER') {
        //   // this.feed.openComment = true;
        //   console.log('JOB TITLE FEED', this.feed);
        //   // this.viewFeedComments(this.feed);
        //   // this.feed.comentDescription = `Congratulations! ${this.feed.owner.firstName} ${this.feed.owner.lastName}`;
        // }
    }
    // this.tagsUsed = this.feedItem.neo4jHashTagVOs;
  }

  checkPostDescriptionLength(postDescription) {

    const html = this.document.createElement('p');    
    html.innerHTML = postDescription;
    const txtCntLen = html.textContent.length;
    if(txtCntLen>400) {
      return true;
    } else {
      return false;
    }
  }

  returnPostDescription(postDescription) {
    const p = this.document.createElement('p');
    p.innerHTML = postDescription;
    const txtCntLen = p.textContent.length;
    const splitPD = p.textContent.split('@');
    let stringWithoutTags = postDescription?.replace(/<[^>]+>/g, '')?.replace(/\sdata-(value|link)="[^"]*"/g, '');
    const sliceIndex = stringWithoutTags.length <= postDescription.length/5 ? 400 * splitPD.length : 
                       stringWithoutTags.length >= postDescription.length - 10 && postDescription.length <400?postDescription.length:400 *splitPD.length-1;
    if( txtCntLen >= 400 ) {
      return postDescription.slice(0,sliceIndex);
    } else {
      return postDescription;
    }

  }

  loadHashtagProfile(hashtagName){
    if(window.location.href.includes('hashtag-profile')){
     let hashtagPageName = window.location.href.split('hashtag-profile/')[1];
     let removedHash = this.removeHash(hashtagName)
     if(hashtagPageName.replace(/%20/g,' ') === removedHash){
      return
     }
    }
    this.router.navigate(['/mynetwork/hashtag-profile/'+this.removeHash(hashtagName)]);
  }
  removeHash(hashtagName){
    if(hashtagName[0]=='#'){
      hashtagName = hashtagName.slice(1);
      if(hashtagName[0]=='#'){
        this.removeHash(hashtagName)
      }
    }
    if(!hashtagName){
      hashtagName = '%20'
    }
    return hashtagName;
  }

  uploadImage(event) {
    this.image = event.target.files[0];
    let fr = new FileReader();
    fr.readAsDataURL(this.image);
    fr.onload = (event: any) => {
      this.displayImage = fr.result;
    };
  }

  uploadFile(event) {
    this.dispalyfile = event.target.files[0];
  }

  openShareDocument(template: TemplateRef<any>) {
    // this.modalRef.hide();
    this.videoModalRef = this.modalService.show(template,
      Object.assign({}, { class: 'modal-dialog-centered' })
    );
  }

  createPost(template: TemplateRef<any>) {
    this.whoCanSeeValue = 'anyone';
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'modal-dialog-centered' })
    );
  }

  discardPost(template: TemplateRef<any>) {
    this.discardModalRef = this.modalService.show(template,
      Object.assign({}, { class: 'confirmDiscard modal-sm' })
    );
  }

  updateFeed() {
    let ids = [];
    if (this.selectedTags.length > 0) {
      this.selectedTags.forEach(element => ids.push(element.hashTagId));
    }
    this.feedService.updateFeedItem({
      postDescription: this.feedContent,
      feedItemId: this.editFeed.feedItemId,
      hashTagIds: ids
    }).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.snack.openSnackBar('success', 'You Successfully added a post');
        this.modalRef.hide();
        this.dispalyfile = null;
        this.videoUrl = null;
        this.displayImage = null;
        this.image = null;
        this.videoDescription = null;
        this.feedContent = null;
        this.editFeed = null;
        this.selectedTags = [];
        //  this.getGroupFeed();
      } else {
        this.snack.openSnackBar('info', res.message);
      }
    });
  }

  editComment(comment, commentIndex) {
    if (comment.editCommentContent.updatedComment == "" || comment.editCommentContent.updatedComment == undefined) {
      this.snack.openSnackBar('info', 'Please enter a comment to update');
    }else {
    this.feedService.editComment({
      feedItemCommentId: comment.editCommentContent.feedItemCommentId,
      feedItemComment: comment.editCommentContent.updatedComment
    }).subscribe(res => {
      if (res.status === 'SUCCESS') {
        //comment.feedItemCommentVos[comment.editCommentContent.commentIndex] = res.map.feedItemCommentVo;
        this.feed.feedItemCommentVos[commentIndex] = res.map.feedItemCommentVo;;        
        this.feed.feedItemCommentVos[commentIndex].editComment = false;
        this.feed.feedItemCommentVos[commentIndex].editCommentContent = null;
        //comment.editComment = false;
        //comment.editCommentContent = null;
      }
    });
  }
  }

  editReplay(rcomment, j, k) {
    if (rcomment.editContent.updatedDescription == "" || rcomment.editContent.updatedDescription == undefined) {
      this.snack.openSnackBar('info', 'Please enter a comment to post');
    }else {
    this.feedService.editReplay({
      feedItemCommentId: rcomment.editContent.feedItemCommentId,
      feedItemComment: rcomment.editContent.updatedDescription
    }).subscribe(res => {
      if (res.status === 'SUCCESS') {
        rcomment.commentReplies[k] = res.map.feedItemCommentVo;
        this.feed.feedItemCommentVos[j].commentReplies[k].feedItemComment = res.map.feedItemCommentVo.feedItemComment;
        this.feed.feedItemCommentVos[j].commentReplies[k].hideDelete = false;
        this.feed.feedItemCommentVos[j].commentReplies[k].editReplay = false;
        this.feed.feedItemCommentVos[j].commentReplies[k].editContent = null;
        rcomment.editReplay = false;
        rcomment.editContent = null;
      }
    });
  }
  }

  hidePopups() {
    this.discardModalRef.hide();
    this.modalRef.hide();
  }

  postFeed() {
    let fd = new FormData();
    if (this.feedContent) {
      fd.append('postDescription', this.feedContent);
    }
    // fd.append('hashTagIds', []);
    if (this.image) {
      fd.append('multipartFile', this.image);
    }
    if (this.dispalyfile) {
      fd.append('multipartFile', this.dispalyfile);
    }
    // fd.append('groupId', this.groupInfo.groupId);
    fd.append('whoCanSee', this.whoCanSeeValue);
    if(this.whoCanSeeValue === 'groups') {
      fd.append('groupId', this.feedPostSelectGroup.id);
    }
    if (this.videoUrl) {
      fd.append('videoLink', this.videoUrl);
    }
    if (this.videoDescription) {
      fd.append('videoDescription', this.videoDescription);
    }
    if (this.selectedTags.length > 0) {
      this.selectedTags.forEach(element => {
        fd.append('hashTagIds', element.hashTagId);
      });
    }
    if (!fd.has('postDescription') && !fd.has('multipartFile') && !fd.has('videoLink') && !fd.has('videoDescription') && !fd.has('hashTagIds')) {
      this.snack.openSnackBar('failure', 'Add atleast one field');
      return;
    }
    // console.log(this.feedContent, this.image, this.displayImage, this.dispalyfile, this.videoUrl, this.videoDescription, this.selectedTags);
    this.feedService.postFeed(fd).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.snack.openSnackBar('success', 'You Successfully added a post');
        this.modalRef.hide();
        this.feedContent = null;
        this.dispalyfile = null;
        this.videoUrl = null;
        this.displayImage = null;
        this.image = null;
        this.videoDescription = null;
        this.selectedTags = [];
        //this.feedItems.unshift(res.map.itemVo);
        //  this.getFeed();
      } else {
        this.snack.openSnackBar('info', res.message);
      }
    });
  }
  async copyFeedLink(tagId){
    await this.conns.copyLinkToPost(tagId);
    // this.snack.openSnackBar('success', 'Post Link copied to clipboard');
    this.snack.openSnackBar('success', 'Link has been copied to clipboard successfully');
  }
  
  viewFeedComments(feed) {
    if (this.isLoggedIn()) { 
    if(feed.commentsVisiblity === 'none' || (feed.commentsVisiblity === 'connection' && feed.userConnectedWithOwner === false) ) {
      return;
    }
    if (!feed.openComment) {
      feed.openComment = true;
      this.feedPage = 1;
      this.feedsLimit = 2;
      let type = this.presentCompany ? 'company':this.presentInternship ? 'internship':null;
      let id = this.presentCompany ? this.presentCompany['companyId']:this.presentInternship ? this.presentInternship['internshipId']:null;
      let isUserCompany = type === 'company' ? this.presentCompany['userCompany'] : type === 'internship' ? this.presentInternship['userInternship'] : null;
      if(!this.isFeedComponent && type && isUserCompany){
        this.conns.getGroupFeedCommentsForCompany(feed.feedItemId, this.feedPage, this.feedsLimit,type,id).subscribe(res => {
          this.feed.feedItemCommentVos = res.map.feedItemCommentVos;          
        });
      }else{
        this.conns.getGroupFeedComments(feed.feedItemId, this.feedPage, this.feedsLimit).subscribe(res => {
          // this.commentsInFeed = res.map.feedItemCommentVos;
          this.feed.feedItemCommentVos = res.map.feedItemCommentVos;
          // if(this.feed.jobTitleFeed && this.feed.userType !== 'OWNER') {
          //   // this.feed.comentDescription = `Congratulations! ${this.feed.owner.firstName} ${this.feed.owner.lastName}`;
          // } else {
          //   this.feed.comentDescription = '';
          // }
          
        });
      }
    } else {
      feed.openComment = false;
      return;
    }
  }else{
    this.keyauth.updateKeycloakRedirectUrL('jobseeker',window.location.pathname);
    this.keyauth.login();
  }
  }


  loadMoreFeedComments(feed) {
    // feed.openComment = true;
    this.feedPage = this.feedPage + 1;
    this.feedsLimit = 10;
    this.conns.getGroupFeedComments(feed.feedItemId, this.feedPage, this.feedsLimit).subscribe(res => {
    this.feed.feedItemCommentVos.push(...res.map.feedItemCommentVos);
    });
  }

  viewFeedCommentReplies(comment, j) {
    if (!comment.openReplies) {
      comment.openReplies = true;
      let type = this.presentCompany ? 'company':this.presentInternship ? 'internship':null;
      let id = this.presentCompany ? this.presentCompany['companyId']:this.presentInternship ? this.presentInternship['internshipId']:null;
      let isUserCompany = type === 'company' ? this.presentCompany['userCompany'] : type === 'internship' ? this.presentInternship['userInternship'] : null;
      if(!this.isFeedComponent && type && isUserCompany){
        this.conns.getGroupFeedCommentRepliesForCompany(comment.feedItemCommentId,type,id).subscribe(res => {
          comment.commentReplies = res.map.feedItemCommentVos;
        });
      }else{
        this.conns.getGroupFeedCommentReplies(comment.feedItemCommentId).subscribe(res => {
          comment.commentReplies = res.map.feedItemCommentVos;
        });
      }
    } else {
      comment.openReplies = false;
      return;
    }
  }

  logChange($event) {
    let ex = /(#\w{1,})(?!.*\1)/i; //^wp.*php$
    const match = $event.html.match(ex);
    if (match) {
      // this.getTagSuggetions(match);
    }
  }

 

  likePost(feed) {
    if (this.isLoggedIn()) {
      if (this.companyFeeds && this.isUserAdminInInternshipPage) {
        this.feedService.companyLikePost(feed.feedItemId, feed.companyDTO.companyId, !feed.companyDTO.internship).subscribe(res => {
          if (res.status === 'SUCCESS') {
            this.feed.likesCount = res.map.likesCount;
            this.feed.postLiked = res.map.isPostLiked;
          } else {
            this.feed.likesCount = res.map.likesCount;
            this.feed.postLiked = res.map.isPostLiked;
          }
        });
      } else {
        this.feedService.likePost(feed.feedItemId).subscribe(res => {
          if (res.status === 'SUCCESS') {
            this.feed.likesCount = res.map.likesCount;
            this.feed.postLiked = res.map.isPostLiked;
          } else {
            this.feed.likesCount = res.map.likesCount;
            this.feed.postLiked = res.map.isPostLiked;
          }
        });
      }
    }else{
      this.keyauth.updateKeycloakRedirectUrL('jobseeker',window.location.pathname);
      this.keyauth.login();
    }
  }

  likeComment(comment, commentIndex, commentType = 'rootComment') {
    //console.log(comment, commentIndex, this.feed.feedItemCommentVos[commentIndex]);
    if(this.companyFeeds && this.isUserAdminInInternshipPage) {
      this.feedService.likeCommentByCompany(comment.feedItemCommentId, commentType, 
        this.presentCompany ? this.presentCompany['companyId'] : this.presentInternship['internshipId'], !comment?.companyDTO?.internship).subscribe(res => {
        if (res.status === 'SUCCESS') {
          comment.commentLikeCount = comment.likesCount;
          this.feed.feedItemCommentVos[commentIndex].commentLikeCount = res.map.likeCount;
          this.feed.feedItemCommentVos[commentIndex].liked = true;
        } else {
          this.feed.feedItemCommentVos[commentIndex].commentLikeCount = res.map.likeCount;
          this.feed.feedItemCommentVos[commentIndex].liked = false;
        }
      });
    } else {
      this.feedService.likeComment(comment.feedItemCommentId, commentType).subscribe(res => {
        if (res.status === 'SUCCESS') {
          comment.commentLikeCount = comment.likesCount;
          this.feed.feedItemCommentVos[commentIndex].commentLikeCount = res.map.likeCount;
          this.feed.feedItemCommentVos[commentIndex].liked = true;
        } else {
          this.feed.feedItemCommentVos[commentIndex].commentLikeCount = res.map.likeCount;
          this.feed.feedItemCommentVos[commentIndex].liked = false;
        }
      });
    }
  }

  likeReply(reply, commentIndex, replyIndex, commentType = 'replyComment') {
    if(this.companyFeeds && this.isUserAdminInInternshipPage) {
      this.feedService.likeReplyByCompany(reply.feedItemCommentId, commentType,
        this.presentCompany ? this.presentCompany['companyId'] : this.presentInternship['internshipId'], !reply?.companyDTO?.internship).subscribe(res => {
        if (res.status === 'SUCCESS') {
          this.feed.feedItemCommentVos[commentIndex].commentReplies[replyIndex].commentLikeCount = res.map.likeCount;
          this.feed.feedItemCommentVos[commentIndex].commentReplies[replyIndex].liked = true;
        } else {
          this.feed.feedItemCommentVos[commentIndex].commentReplies[replyIndex].commentLikeCount = res.map.likeCount;
          this.feed.feedItemCommentVos[commentIndex].commentReplies[replyIndex].liked = false;
        }
      });
    } else {
      this.feedService.likeReply(reply.feedItemCommentId, commentType).subscribe(res => {
        if (res.status === 'SUCCESS') {
          this.feed.feedItemCommentVos[commentIndex].commentReplies[replyIndex].commentLikeCount = res.map.likeCount;
          this.feed.feedItemCommentVos[commentIndex].commentReplies[replyIndex].liked = true;
        } else {
          this.feed.feedItemCommentVos[commentIndex].commentReplies[replyIndex].commentLikeCount = res.map.likeCount;
          this.feed.feedItemCommentVos[commentIndex].commentReplies[replyIndex].liked = false;
        }
      });
    }
  }

  isSendComment: boolean = false;
  addComment(feed) {
    if(this.isLoggedIn()){
    // if(this.isSendComment) return;
    this.isSendComment = true;
    if(this.companyFeeds && this.isUserAdminInInternshipPage) {
      if (feed.comentDescription == ''|| !feed.comentDescription?.trim()  || feed.comentDescription == undefined) {
        this.isSendComment = false;
        this.snack.openSnackBar('info', 'Please enter a comment to post');
      } else {
        this.feedService.commentOnPost({
          feedItemComment: feed.comentDescription.trim(),
          id: feed.companyDTO.companyId,
          cmp: !feed.companyDTO.internship ? true : false,
        }, feed.feedItemId).subscribe(res => {
          if (res.status === 'SUCCESS') {
            this.feed.comentDescription = '';
            this.feed.commentsCount = res.map.feedItemCommentVo.commentsCount;
            this.feed.feedItemCommentVos.unshift(res.map.feedItemCommentVo);
            this.feed.feedItemCommentVos = feed.feedItemCommentVos;
            this.isSendComment = false;
          }
        });
      }
    } else {
      if (!feed.comentDescription || (feed.comentDescription && feed?.comentDescription.trim() == "")) {
        this.isSendComment = false;
        this.snack.openSnackBar('info', 'Please enter a comment to post');
      } else {
        this.feedService.commentOnPost({
          feedItemComment: feed.comentDescription.trim()
        }, feed.feedItemId).subscribe(res => {
          if (res.status === 'SUCCESS') {
            this.feed.comentDescription = '';
            //this.feed.openComment = false;
            // feed.openComment = false;
            // feed.commentsCount = feed.commentsCount + 1;
            this.feed.commentsCount = res.map.feedItemCommentVo.commentsCount;
            this.feed.feedItemCommentVos.unshift(res.map.feedItemCommentVo);
            this.feed.feedItemCommentVos = feed.feedItemCommentVos;
            this.isSendComment = false;
            // this.getFeed();
          }
        });
      }
    }
  }
  }

  replyToComment(comment, commentIndex) {
    if(this.isSendComment) return;
    this.isSendComment = true;
    if(this.companyFeeds && this.isUserAdminInInternshipPage) {
      if (comment.comentDescription.trim() == "" || comment.comentDescription == undefined) {
        this.isSendComment = false;
        this.snack.openSnackBar('info', 'Please enter a reply to comment');
      } else {
        this.feedService.replayOnComment({
          feedItemComment: comment.comentDescription.trim(),
          id: comment?.companyDTO?.companyId || 0,
          cmp: !comment?.companyDTO?.internship ? true : false,
        }, comment.feedItemCommentId).subscribe(res => {
          if (res.status === 'SUCCESS') {
            comment.comentDescription = '';
            comment.openComment = false;
            this.isSendComment = false;
            // comment.replyCommentCount = res.map.feedItemCommentVo['replyCommentCount'];
            this.feed.feedItemCommentVos[commentIndex].replyCommentCount = res.map.feedItemCommentVo['replyCommentCount'];
            comment.commentReplies.push(res.map.feedItemCommentVo);
          }
        });
      }
    } else {
      if (!comment.comentDescription || (comment.comentDescription && comment?.comentDescription.trim() == "")) {
        this.isSendComment = false;
        this.snack.openSnackBar('info', 'Please enter a reply to comment');
      }
      if (comment.comentDescription.trim() == "" || comment.comentDescription == undefined) {
        this.isSendComment = false;
        this.snack.openSnackBar('info', 'Please enter a reply to comment');
      } else {
        this.feedService.replayOnComment({
          feedItemComment: comment.comentDescription.trim()
        }, comment.feedItemCommentId).subscribe(res => {
          if (res.status === 'SUCCESS') {
            comment.comentDescription = '';
            comment.openComment = false;
            this.isSendComment = false;
            // comment.replyCommentCount = res.map.feedItemCommentVo['replyCommentCount'];
            this.feed.feedItemCommentVos[commentIndex].replyCommentCount = res.map.feedItemCommentVo['replyCommentCount'];
            comment.commentReplies.push(res.map.feedItemCommentVo);
          }
        });
      }
    }
  }

  getRedirectURL(data, type) {
    if(type === 'comment') {
      if(data.companyDTO.internship) {
        return `/internship-overview/working-at-${data.companyDTO.redirectUrl}-overview-${data.companyDTO.companyUniqueId}`
      } else {
        return `/overview/working-at-${data.companyDTO.redirectUrl}-${data.companyDTO.companyUniqueId}`
      }
    }
  }

  editFeedItem(feed) {
    /*
    this.feedContent = feed.postDescription;
    this.selectedTags = feed.neo4jHashTagVOs || [];
    if (this.selectedTags.length > 0) {
      this.displayTags = true;
    }*/
    feed.presentIndex = this.presentFeedIndex;
    // console.log(feed);
    this.editTheFeed.emit({feed:feed})
    //this.editFeed = feed;
    //this.editFeed.index = index;
    /*this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'modal-dialog-centered' })
    );*/
  }

  hidePost(feed) {
    if (this.isLoggedIn()) {

    this.feedService.hidePost(feed.feedItemId).subscribe(res => {
      if (res.status === 'SUCCESS') {
        // this.getFeed();
        this.deleteTheFeed.emit(this.presentFeedIndex);
        this.snack.openSnackBar('success', 'Post hidden successfully');
        // this.feedChanged.emit(true);
      } else {
        this.snack.openSnackBar('info', res.message ? res.message : 'oops! something went wrong.');
      }
    });
  }
  else{
    this.keyauth.updateKeycloakRedirectUrL('jobseeker',window.location.pathname);
    this.keyauth.login();
  }
  }

  sharePost(feed) {
    // this.feedService.sharePost(feed.feedItemId).subscribe(res => {
    //   if (res.status === 'SUCCESS') {
    //     this.feed.sharedCount = feed.sharedCount+1;
    //     this.snack.openSnackBar('success', 'successfully shared the post');
    //   } else {
    //     this.snack.openSnackBar('info', res.message ? res.message : 'oops! something went wrong.');
    //   }
    // })
    console.log('share btn is clicked',feed)
    this.shareTheFeed.emit({feed:feed})
  }

  saveFeedItem(feed) {
    if(this.isLoggedIn()){
    this.feedService.savePost(feed.feedItemId, 'save').subscribe(res => {
      if (feed.postSaved !== true && res.status === 'SAVED') {
        feed.postSaved = true;
        this.feed.postSaved = true;
        this.snack.openSnackBar('success', 'Post saved successfully');
      } else {
        this.snack.openSnackBar('info', res.message ? res.message : 'oops! something went wrong.');
      }
    });
  }else{
    this.keyauth.updateKeycloakRedirectUrL('jobseeker',window.location.pathname);
    this.keyauth.login();
  }
  }

  unSaveFeedItem(feed) {
    this.feedService.savePost(feed.feedItemId, 'unsave').subscribe(res => {
      if (feed.postSaved === true && res.status === 'UN_SAVED') {
        feed.postSaved = false;
        this.feed.postSaved = false;
        this.unsaveFeedItemData.emit(feed.feedItemId)
        this.snack.openSnackBar('success', 'Post Unsaved successfully');
      } else {
        this.snack.openSnackBar('info', res.message ? res.message : 'oops! something went wrong.');
      }
    });
  }

  deleteFeedConfirmModal(template: TemplateRef<any>) {
    this.delFeedModalRef = this.modalService.show(template, { class: 'withdrawConfirm modal-sm modal-dialog-centered' });
  }

  deleteCommentConfirmModal(template: TemplateRef<any>) {
    this.delComModalRef = this.modalService.show(template);
  }

  deleteReplyConfirmModal(template: TemplateRef<any>) {
    this.delRepModalRef = this.modalService.show(template);
  }

  deleteFeedItem(id) {
    this.isdeletedfeed = true;
    this.conns.deleteFeedItem(id).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.isdeletedfeed = true;
        // this.feedChanged.emit(true);
        this.deleteTheFeed.emit(this.presentFeedIndex);
        this.delFeedModalRef.hide();
        this.snack.openSnackBar('success', 'Your post has been deleted successfully');
      } else {
        this.isdeletedfeed = false;
        this.snack.openSnackBar('info', res.message ? res.message : 'oops something went wrong.');
      }
    });
  }

  deleteFeedItemComment(comment, commentindex, type, rootId, indexr?) {
    let companyOrInternship = this.presentCompany ? 'company':this.presentInternship ? 'internship':null;
    let companyOrInternshipid = this.presentCompany ? this.presentCompany['companyId']:this.presentInternship ? this.presentInternship['internshipId']:null;
    let isUserCompanyOrInternship =  this.presentCompany ? this.presentCompany['userCompany']:this.presentInternship ? this.presentInternship['userInternship']:null;
    if(companyOrInternship && isUserCompanyOrInternship){
      this.conns.deleteFeedItemCommentForCompanyOrIntership(comment.feedItemCommentId, type, rootId,companyOrInternship,companyOrInternshipid).subscribe(res => {
        if (res.status === 'SUCCESS') {
          if (indexr !== undefined) {
            // console.log('indexr ', indexr);
            this.delRepModalRef.hide();
            this.feed.feedItemCommentVos[commentindex].commentReplies.splice(indexr, 1);
            this.feed.feedItemCommentVos[commentindex].replyCommentCount = res.map.commentCount;
            //this.feed.feedItemCommentVos[commentindex].replyCommentCount = res.map.feedItemCommentVo['replyCommentCount'];
            this.snack.openSnackBar('success', 'You deleted reply successfully');
          } else {
            if(type == 'replyComment'){
              this.delRepModalRef.hide();
              this.feed.feedItemCommentVos[commentindex].commentReplies.splice(indexr, 1);
              this.feed.feedItemCommentVos[commentindex].replyCommentCount = res.map.commentCount;
            }else{
              this.delComModalRef.hide();
              this.feed.feedItemCommentVos.splice(commentindex, 1);
              this.feed.commentsCount = res.map.commentCount;
              // this.snack.openSnackBar('success', 'You deleted comment successfully');
              this.snack.openSnackBar('success', 'Your comment was deleted successfully');
            }
          }
        }
      });
    }else{
      this.conns.deleteFeedItemComment(comment.feedItemCommentId, type, rootId).subscribe(res => {
        if (res.status === 'SUCCESS') {
          if (indexr !== undefined) {
            // console.log('indexr ', indexr);
            this.delRepModalRef.hide();
            this.feed.feedItemCommentVos[commentindex].commentReplies.splice(indexr, 1);
            this.feed.feedItemCommentVos[commentindex].replyCommentCount = res.map.commentCount;
            //this.feed.feedItemCommentVos[commentindex].replyCommentCount = res.map.feedItemCommentVo['replyCommentCount'];
            this.snack.openSnackBar('success', 'You deleted reply successfully');
          } else {
            if(type == 'replyComment'){
              this.delRepModalRef.hide();
              this.feed.feedItemCommentVos[commentindex].commentReplies.splice(indexr, 1);
              this.feed.feedItemCommentVos[commentindex].replyCommentCount = res.map.commentCount;
            }else{
              this.delComModalRef.hide();
              this.feed.feedItemCommentVos.splice(commentindex, 1);
              this.feed.commentsCount = res.map.commentCount;
              // this.snack.openSnackBar('success', 'You deleted comment successfully');
              this.snack.openSnackBar('success', 'Your comment was deleted successfully');
            }
          }
        }
      });
    }
  }

  whoCanSeePostModel(template: TemplateRef<any>) {
    this.whoCanSeePostModalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  userGroupsModel(template: TemplateRef<any>) {
    this.conns.getGroups().subscribe(res => {
      this.userGroups = res.map.userGroups || [];
     });
    this.userGroupsModalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  showWholikedModal(template: TemplateRef<any>, type) {
    if (this.isLoggedIn()) {
    this.isCommentLikedList = false;
    this.isLastTextInModal = false;
    this.postActivityMembers = [];
    if(type === 'LIKE') {
      this.loaderInPostActivityModal = true;
      this.getLikesList(this.currentLikesPage);
    } else {
      this.loaderInPostActivityModal = true;
      this.getSharesList(this.currentLikesPage);
    }
    this.showWholikedModalRef = this.modalService.show(template, { class: 'modal-dialog-centered likeModal' });
  }
  }

  showWholikedCommentModal(template: TemplateRef<any>, data, type, commentIndex, replyIndex?) {
    this.isSharedList = false;
    this.isLastTextInModal = true;
    this.postActivityMembers = [];
    if(type === 'COMMENT') {
      this.loaderInPostActivityModal = true;
      this.getCommentLikesList(this.currentLikesPage, data.feedItemCommentId,template);
    } else {
      this.loaderInPostActivityModal = true;
      this.getReplyLikedList(this.currentLikesPage, data.feedItemCommentId,template);
    }
  }
  
  getLikesList(page) {
    this.feedService.showWhoLikedList(this.feed.feedItemId, page).subscribe(res => {
      this.postActivityMembers = res.map.usersList || [];
      this.loaderInPostActivityModal = false;
     });
     this.isSharedList = false;
  }

  getSharesList(page) {
    this.feedService.showWhoSharedList(this.feed.feedItemId, page).subscribe(res => {
      this.postActivityMembers = res.map.usersList || [];
      this.loaderInPostActivityModal = false;
     });
     this.isSharedList = true;
  }

  getCommentLikesList(page, id,template) {
    this.feedService.showWhoLikedCommentList(id, page).subscribe(res => {
      this.postActivityMembers = res.map.usersList || [];
      this.loaderInPostActivityModal = false;
      this.showWholikedModalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
     });
     this.isCommentLikedList = true;
  }

  getReplyLikedList(page, id,template) {
    this.feedService.showWhoLikedReplyList(id, page).subscribe(res => {
      this.postActivityMembers = res.map.usersList || [];
      this.loaderInPostActivityModal = false;
      this.showWholikedModalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
     });
     this.isCommentLikedList = false;
  }

  openWhoCanCommentOptions(template: TemplateRef<any>){
    this.whoCanCommentValue = this.feed.commentsVisiblity;
    this.whoCanCommentOnPostModalRef = this.modalService.show(template, {
      class: "modal-dialog-centered",
    });
  }

  changewhoCanComment(feed) {
    this.feedService.updateWhoCanComment(this.feed.feedItemId, this.whoCanCommentValue).subscribe(res => {
      if(res.status === 'SUCCESS') {
        this.viewFeedComments(feed);
        this.feed.commentsVisiblity = this.whoCanCommentValue;
        feed.openComment = false;
        // this.snack.openSnackBar('success', 'Comments Visibilty Updated');
        this.snack.openSnackBar('success', 'Commenting permissions updated');
      }
     });
  }

  openReportModal(){
    if (this.isLoggedIn()) {
      this.dialog.open(ReportFeedComponent, {
        width: '40vw',
        height: '65vh',
      });
    }else{
      this.keyauth.updateKeycloakRedirectUrL('jobseeker',window.location.pathname);
      this.keyauth.login();
    }
  }
  @HostListener('window:scroll', [])
  scrollHandler() {
    for (let index = 0; index < this.trigger.toArray().length; index++) {
      this.trigger.toArray()[index].closeMenu();
    }
  }

  //Posts & Activity
  getActivityType(feed) {
    if(feed.activityType === 'LIKE_FEED_ITEM') {
        if(feed.groupId === 0) {
          return ' likes this'
        } else {
          return ' liked a post in ';
        }
    } else if(feed.activityType === 'FEED_ITEM_POSTED_BY') {
      // return feed.activityType;
      if(feed.groupId === 0) {
        return ' posted this'
      } else {
        return ' posted in ';
      }
    } else if( feed.activityType === 'COMMENT_OWNER_REPLY') {
      // feed.openComment = true;
      // feed['feedItemCommentVos'][0].openReplies = true;
      if(feed.groupId === 0) {
        return ' replied to a comment on this post'
      } else {
        return ' replied to a comment on a post in ';
      }
    } else if( feed.activityType === 'COMMENT_OWNER') {
      // feed.openComment = true;
      if(feed.groupId === 0) {
        return ' commented on this post'
      } else {
        return ' commented on a post in ';
      }
    } else if( feed.activityType === 'COMMENT_LIKED') {
      // feed.openComment = true;
      if(feed.groupId === 0) {
        return ' liked a comment on this post'
      } else {
        return ' liked a comment on a post in ';
      }
    } else if( feed.activityType === 'COMMENT_LIKED_REPLY') {
      // feed.openComment = true;
      // feed['feedItemCommentVos'][0].openReplies = true;
      if(feed.groupId === 0) {
        return ' liked a reply in a comment on this post'
      } else {
        return ' liked a reply in a comment on a post in ';
      }
    } else if( feed.activityType === 'SHARE_FEED_ITEM') {
      if(feed.groupId === 0) {
        return ' shared this'
      } else {
        return ' shared in ';
      }
    } else {
      return '';
    }
  }

  @ViewChild('imgDialog') imgDialog: TemplateRef<any>;

  enlargeImage(imagePath:any){
    this.dialog.open(this.imgDialog, {
      data: {imagePath: imagePath},
      width: '60vw',
      height:'75vh'
    });
  }

  @ViewChild('docDialog') docDialog: TemplateRef<any>;
  dialogRef:MatDialogRef<any>
  enlargeDoc(imagePaths:any,feedItemId:number,elName:string){
    if(elName == 'span') return;
    this.dialogRef = this.dialog.open(this.docDialog, {
      data: {imagePaths: imagePaths, feedItemId:feedItemId},
      disableClose:true
      // width: '100vw',
      // height:'100vh'
    });
  }

  downloadDoc(feedItem:number){
    const filePath = this.feed?.filePath || this.feed?.sharedFeedOn.filePath as string;
    const arr = filePath.split('/');
    const name = arr[arr.length - 1];
    this.feedService.downloadUploadedDocument(feedItem).subscribe((res:any)=>saveAs(res,name));
  }

  quillConfig = {
    toolbar:false,
    }

  isLoggedIn(){
    if (this.userdata.authenticated && this.userdata.availableRoles.indexOf('jobseeker') !== -1) { 
      return true;
      } else {
        this.keyauth.updateKeycloakRedirectUrL('jobseeker', window.location.href.replace(window.location.origin, ''));
      }
  }
}