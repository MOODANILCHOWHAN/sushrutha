// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-feed',
//   templateUrl: './feed.component.html',
//   styleUrl: './feed.component.css'
// })
// export class FeedComponent {

// }
import {Component,HostListener,Inject,OnInit,PLATFORM_ID,QueryList,Renderer2,TemplateRef,ViewChild,ViewChildren} from "@angular/core";
import { ShowerrorsService } from "../../../../../app/shared/providers/showerrors.service";
import { NotificationsallService } from "../../../../../app/providers/notifications.service";
import { FeedService } from "../../../../../app/jobseeker/providers/feed.service";
import { ManageConnectionsService } from "../../../../../app/jobseeker/providers/manage-connections.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { UserState } from "../../../../../app/shared/models/user.state";
import { MatMenuTrigger } from "@angular/material/menu";
import { map } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import { LocationserviceService } from "../../../../../app/core/providers/locationservice.service";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { PortfolioserviceService } from "../../../../../app/jobseeker/providers/portfolioservice.service";
// import  "quill-mention";
import * as QuillNamespace from "quill";
import QuillMention from "quill-mention";
import MagicUrl from "quill-magic-url";

const Quill: any = QuillNamespace;
Quill.register({ "modules/mention": QuillMention }, true);
Quill.register({ "modules/magicUrl": MagicUrl }, true);
import Delta from "quill-delta";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CreatePostCardComponent } from "../../../../shared/components/create-post-card/create-post-card.component";

const Clipboard = Quill.import("modules/clipboard");

class PlainTextClipboard extends Clipboard {
  onPaste(e) {
    if (e.defaultPrevented || !this.quill.isEnabled()) return;
    let range = this.quill.getSelection();
    let delta = new Delta().retain(range.index);

    if (
      e &&
      e.clipboardData &&
      e.clipboardData.types &&
      e.clipboardData.getData
    ) {
      let text = (e.originalEvent || e).clipboardData.getData("text/plain");
      let cleanedText = this.convert(text);

      // Stop the data from actually being pasted
      e.stopPropagation();
      e.preventDefault();

      // Process cleaned text
      delta = delta.concat(cleanedText).delete(range.length);
      this.quill.updateContents(delta, Quill.sources.USER);
      // range.length contributes to delta.length()
      this.quill.setSelection(
        delta.length() - range.length,
        Quill.sources.SILENT
      );

      return false;
    }
  }
}

Quill.register("modules/clipboard", PlainTextClipboard);

@Component({
  selector: "feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"],
})
export class FeedComponent implements OnInit {
  modalRef: BsModalRef;
  fileSubscription = new Subscription();
  feedContent: never[] | null;
  deletecomment: any;
  disableComment = true;
  feedTypeSelected = "Recommend";
  modules = {
    formula: true,
    toolbar: false,
  };
  userState: UserState;
  feedItems: any;
  currentPage = 1;
  totalPages: any;
  image: any;
  videoLink: any;
  displayImage: any;
  dispalyfile: any;
  videoUrl: any;
  displayTags: Boolean = false;
  selectedTags = [];
  paginationDatacame = false;
  editFeed: any;
  shareFeed: any;
  whoCanSeeValue = "anyone";
  whoCanCommentValue = "anyone";
  loggedInUser: any;
  feedData = false;
  feedPostSelectGroup = { id: null, name: null, logoPath: null };
  dispalyfileData: any;
  sanitVideoUrl: any;
  sharedFeedTags = [];
  sharedSanitVideoUrl: any;
  nofeeds:boolean=false;
  videoForm: FormGroup;
  connList = [];
  selectedSpecificConnectionsDets = [];
  selectedExceptConnectionsDets = [];
  users = [];
  mentionConfig: any;
  createPostFileLoading: Boolean = false;
  trigger: any;
  constructor(
    public notifications: NotificationsallService,
    public snack: ShowerrorsService,
    private feed: FeedService,
    private conns: ManageConnectionsService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private locser: LocationserviceService,
    @Inject(DOCUMENT) private CustomDocument: Document,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private modalService: BsModalService,
    public dialogRef: MatDialog,
    private portfolioser: PortfolioserviceService,
    private ip: ShowerrorsService,
    private fb: FormBuilder
  ) {
    this.snack.userState.subscribe((res: any) => {
      this.userState = res;
      if (this.userState && !this.userState?.authenticated) {
        this.modalService.hide();
      }
    });
    this.videoForm = this.fb.group({
      videoDescrip: ["", [Validators.maxLength(1000)]],
      videourl: ["", [Validators.required]],
    });
   
  }

  ngAfterViewInit(): void {
    if (this.snack.isBrowser()) {
      setTimeout(() => {
        this.loadExternalScript(
          "https://cdn.jsdelivr.net/npm/quill-mentions@0.2.4/dist/quill-mentions.js"
        )
          .then((a) => {})
          .catch((e) => {});
      }, 2000);
    }
  }
  ngOnInit() {
    window.addEventListener("scroll", this.scroll, true);
    this.loggedInUser = JSON.parse(localStorage.getItem("loggedUser") || '');
    this.getFeedold(this.feedTypeSelected, false);
    this.route.queryParams.subscribe((res) => {
      if (res !== null || res !== undefined) {
        if (res["id"]) {
          this.feed.getContactInvitation(res["id"]).subscribe((dat: any) => {
            if (dat.status == "SUCCESS") {
              this.feed.acceptInvitation(dat.map.email).subscribe((res:any) => {
                if (res.status === "SUCCESS") {
                  this.router.navigate(["/feed"]);
                }
              });
            }
          });
        }
      }
    });
    this.ip.getClientIp();
  }

  checkPostDescriptionLength(postDescription:any) {
    const html = this.CustomDocument.createElement("p");
    html.innerHTML = postDescription;
    const txtCntLen = html.textContent.length ;
    // if(postDescription.replace(/<\/?[^>]+(>|$)/g, "").length > 300 ) {
    if (txtCntLen > 300) {
      return true;
    } else {
      return false;
    }
  }

  returnPostDescription(postDescription:any) {
    const p = this.CustomDocument.createElement("p");
    p.innerHTML = postDescription;
    const splitPD = p.textContent?.split("@");
    const sliceIndex = 400 * splitPD.length;

    if (postDescription.length > sliceIndex) {
      return postDescription.slice(0, sliceIndex) + " ... ";
    } else {
      return postDescription;
    }
  }

  showMentionSuggestions() {
    this.mentionConfig = {
      mentions: [
        {
          items: this.connList,
          triggerChar: "@",
          mentionSelect: (item:any) => {
            var sel, range;
            if (window.getSelection) {
              sel = window.getSelection();
              if (sel?.anchorNode?.nodeName == "A") {
                sel = sel.anchorNode.parentElement;
              }
              if (sel?.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.setStart(sel.focusNode, sel.focusNode.data.indexOf("@"));
                range.setEnd(
                  sel.focusNode,
                  sel.focusNode.data.indexOf("@") + 1
                );
                range.deleteContents();
                var el = document.createElement("span");
                el.innerHTML = item.redirectUri + "&nbsp;";
                var frag = document.createDocumentFragment(),
                  node,
                  lastNode;
                while ((node = el.firstChild)) {
                  lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                if (lastNode) {
                  sel = window.getSelection();
                  range = document.createRange();
                  range.setStartAfter(lastNode);
                  sel.removeAllRanges();
                  sel.addRange(range);
                }
              }
            }
          },
          insertHTML: true,
          labelKey: "fullName",
          maxItems: 5,
          disableSearch: false,
        },
      ],
    };
  }

  refreshFeed() {
    this.getFeedold(this.feedTypeSelected, false);
  }

  getFeedold(feedType:any, initial?:any) {
    this.feedData = true;
    this.feed
      .getFeedEmail(this.currentPage, feedType)
      .pipe(
        map((res: any) => {
          if (res.map.feedItemVos) {
            res.map.feedItemVos.forEach((element:any) => {
              if (element.videoLink) {
                // element.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(element.videoLink);
                element.originalVideoLink = JSON.parse(JSON.stringify( element.videoLink));
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
            if(res.map.feedItemVos.length == 0){
              this.nofeeds=true;
            }
          } else {
            this.feedItems = res.map.feedItemVos;
            // this.totalPages = +res.map.paginationDTO.totalPages;
            console.log(res.map.feedItemVos.length);
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

  createPost(previewType?: any) {
    this.editFeed = false;
    this.shareFeed = false;
    this.feedContent = [];
    this.whoCanSeeValue = "anyone";
    this.whoCanCommentValue = "anyone";
    this.showMentionSuggestions();
    const initialState = {
      'feedContent':this.feedContent,
      'whoCanSeeValue':this.whoCanSeeValue,
      'editFeed':this.editFeed,
      'whoCanCommentValue':this.whoCanCommentValue,
      'sharedFeedTags':this.sharedFeedTags,
      'displayTags':this.displayTags,
      'sanitVideoUrl':this.sanitVideoUrl,
      'users':this.users,
      'actionType':'openTemplates',
      'fileType':previewType
    }
    this.modalRef = this.modalService.show(
      CreatePostCardComponent,
      Object.assign(
        {},
        { class: "modal-dialog-centered", initialState ,ignoreBackdropClick: true}
      )
    );
    this.modalRef.content.onClose.subscribe((result: any) => {
      this.modalRef.hide();
      if(result.feed){
        this.feedItems.unshift(result.feed.map.itemVo);
      }
    });
    this.deallocateAllValue();
    this.renderer.addClass(this.CustomDocument.body, "reduceZindex");
  }

  uploadVideoFile() {
    this.sanitVideoUrl = this.sanitizeyoutubeurl(this.videoUrl);
  }
  sanitizeyoutubeurl(url:any) {
    const videoid = url.match(
      /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
    );
    if (videoid) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoid[1]}`
      );
    } else {
      this.sanitVideoUrl = null;
      this.videoUrl = null;
      this.snack.openSnackBar("failure", "Please upload a valid video URL");
    }
  }
  
  scroll = (event:any): void => {
    let pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // console.log(pos,max)
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if(this.currentPage ===1 && pos > max/2 && this.totalPages>1){
      //  console.log(pos, max/2 ,this.currentPage ===1 && pos > max/2 && this.totalPages>1 )
      this.currentPage = this.currentPage + 1;
      this.getFeedold(this.feedTypeSelected, true);
    }else if (pos >= max || pos >= max-70 && window.innerWidth < 500) {
      console.log("reached bottom")
      console.log("total page", this.totalPages)
      console.log("current page page", this.currentPage)
      
      //Do your action here
      if (this.totalPages && this.totalPages>= this.currentPage && !this.feedData) {
        // this.paginationDatacame = false;
        this.feedData = false;
        // this.nofeeds = true;
        this.currentPage = this.currentPage + 1;
        this.getFeedold(this.feedTypeSelected, true);
      }
    }
  };

  editFeedItem(data:any,index:any) {
    // New
    var feed = data.feed;
    this.feedContent = feed.postDescription;
    this.whoCanSeeValue = feed.whoCanSee;
    // this.whoCanSeeValue = feed.whoCanSee=='friendsInclude' ? 'Specific Connections' :'friendsExclude' ? 'connections Except':feed.whoCanSee
    this.whoCanCommentValue = feed.commentsVisiblity;
    this.feedPostSelectGroup.id = feed.groupId;
    this.selectedTags = feed.neo4jHashTagVOs || [];
    if (this.selectedTags.length > 0) {
      this.displayTags = true;
    }
    if (data.feed && data.feed?.emails) {
      data.feed.emails.forEach((element1:any) => {
        this.users.forEach((element2, index) => {
          if (element1 == element2.emailId) {
            this.users[index].checked = true;
          }
        });
      });
    }

    if (data.feed.fileType && data.feed.fileType == "file") {
      this.dispalyfileData = data.feed;
    } else if (data.feed.fileType == "Image") {
      this.displayImage = this.snack.getJsImage(
        data.feed.encodedFilePath,
        null
      );
    }
    if (data.feed.videoLink) {
      this.sanitVideoUrl = data.feed.videoLink;
    }
    this.editFeed = feed;
    this.showMentionSuggestions();
        const initialState = {
      'feedContent':this.feedContent,
      'whoCanSeeValue':this.whoCanSeeValue,
      'editFeed':this.editFeed,
      'shareFeed':false,
      'whoCanCommentValue':this.whoCanCommentValue,
      'sharedFeedTags':JSON.parse(JSON.stringify(this.sharedFeedTags)),
      'displayTags':JSON.parse(JSON.stringify(this.displayTags)),
      'sanitVideoUrl':this.sanitVideoUrl,
      'users':this.users,
      'displayImage':this.displayImage,
      'dispalyfileData':this.dispalyfileData,
      'actionType':'edit',
      'selectedTags':JSON.parse(JSON.stringify(this.selectedTags)),
      'groupInfo':{
        groupName:feed['groupName'],
        groupId:feed['groupId']
      }
    }
    this.modalRef = this.modalService.show(
      CreatePostCardComponent,
      Object.assign({}, { class: "modal-dialog-centered" ,initialState, ignoreBackdropClick: true})
    );
    this.modalRef.content.onClose.subscribe((result: any) => {
      if(result.Update_Post){
        this.insertItem(index , result.Update_Post.map.itemVo , 'edit');
      }
      this.deallocateAllValue();
      this.modalRef.hide();
    });
    // this.makeLinkUnEditable();
  }
  deallocateAllValue(){
    this.feedContent = null;
    this.whoCanSeeValue = '';
    this.editFeed = null;
    this.whoCanCommentValue = '';
    this.sharedFeedTags= [];
    this.displayTags= false;
    this.sanitVideoUrl= null;
    this.users= [];
    this.displayImage= null;
    this.dispalyfileData= null;
    this.selectedTags == null;
  }

  shareFeedItem(data:any ,index:any) {
    console.log(data,index)
    this.whoCanSeeValue = "anyone";
    this.whoCanCommentValue = data.feed.commentsVisiblity;
    // this.feedPostSelectGroup.id = data.feed.groupId;
    this.sharedFeedTags = data.feed.neo4jHashTagVOs || [];
    if (this.sharedFeedTags.length > 0) {
      this.displayTags = true;
    }
    if (data.feed && data.feed?.emails) {
      data.feed.emails.forEach((element1:any) => {
        this.users.forEach((element2, index) => {
          if (element1 == element2.emailId) {
            this.users[index].checked = true;
          }
        });
      });
    }
    this.sharedSanitVideoUrl = data.feed.videoLink;
    this.shareFeed = data.feed;
    this.showMentionSuggestions();
    const initialState = {
      'whoCanSeeValue':this.whoCanSeeValue,
      'editFeed':false,
      'whoCanCommentValue':this.whoCanCommentValue,
      'sharedFeedTags':this.sharedFeedTags,
      // 'displayTags':this.displayTags,
      'sharedSanitVideoUrl':this.sharedSanitVideoUrl,
      'shareFeed':this.shareFeed,
      'users':this.users,
      'actionType':'share'
    }
    this.modalRef = this.modalService.show(
      CreatePostCardComponent,
      Object.assign({}, { class: "modal-dialog-centered",initialState , ignoreBackdropClick: true})
    );
    this.modalRef.content.onClose.subscribe((result: any) => {
      this.modalRef.hide();
      if(result.shareFeed){
        this.feedItems[index].sharedCount+=1;
        this.insertItem(index,result.shareFeed.map.itemVo ,'share');
      }
      this.deallocateAllValue();
    });
  }

  insertItem(index:any,item:any,actionType:any){
    if(actionType === 'share'){
      const c = JSON.parse(JSON.stringify(item));
      c.sharedCount = 0
      let modifyGroupFeed =[];
      modifyGroupFeed.push(c);
      this.feedItems.forEach((data: any) =>{
        modifyGroupFeed.push(data);
      })
      this.feedItems = modifyGroupFeed;
     }else{
      for(let i = index; i>=0;i--){
        if(i===0){
          this.feedItems[0]=item;
        }else{
          this.feedItems[i] = this.feedItems[i-1];
        }
      }
     }
  }

  spliceFeedItem(remIndex: any) {
    this.currentPage = 1;
    this.feedItems.splice(remIndex, 1);
    this.refreshFeed();
  }

  filterByOptions(feedType: string) {
    this.feedTypeSelected = feedType;
    this.currentPage = 1;
    this.getFeedold(this.feedTypeSelected, false);
  }

  ngOnDestroy() {
    window.removeEventListener("scroll", this.scroll, true);
    this.renderer.removeClass(this.CustomDocument.body, "reduceZindex");
  }

  @HostListener("window:scroll", [])
  scrollHandler() {
    for (let index = 0; index < this.trigger.toArray().length; index++) {
      this.trigger.toArray()[index].closeMenu();
    }
  }

  // addeportfolioproject() {
  //   let publishedProjectsCount: number;
  //   let totalProjectsCount: number;
  //   let currentSubscriptionPlan: string;
  //   this.portfolioser.getSortProjects("publish", "recent").subscribe((res: { status: string; map: { allProjects: string | any[]; }; }) => {
  //     if (res.status == "SUCCESS") {
  //       publishedProjectsCount = res.map.allProjects.length;
  //       this.portfolioser.getDiscSpace().subscribe((res: { status: string; map: { availableProjectsCount: number; planType: string; }; }) => {
  //         if (res.status == "SUCCESS") {
  //           totalProjectsCount = res.map.availableProjectsCount;
  //           currentSubscriptionPlan = res.map.planType;
  //         }
  //         if (totalProjectsCount >= 0) {
  //           const availableProjectCount =
  //             totalProjectsCount - publishedProjectsCount;

  //           if (
  //             availableProjectCount <= 0 &&
  //             currentSubscriptionPlan == "MAX_PLAN"
  //           ) {
  //             this.dialogRef.open(this.maxPlanAndProjectCountExceeded);
  //             return;
  //           } else if (
  //             availableProjectCount <= 0 &&
  //             currentSubscriptionPlan == "MIN_PLAN"
  //           ) {
  //             this.dialogRef.open(this.projectCountExceeded);
  //             return;
  //           } else {
  //             this.router.navigateByUrl("/add-portfolio");
  //           }
  //         }
  //       });
  //     }
  //   });
  // }

  loadExternalScript(styleUrl: string, cros?: undefined) {
    return new Promise((resolve, reject) => {
      const scriptElement: any = document.createElement("script");
      scriptElement.src = styleUrl;
      scriptElement.type = "text/javascript";
      if (cros) {
        scriptElement.crossorigin = "anonymous";
      }
      scriptElement.onload = resolve;
      document.head.appendChild(scriptElement);
    });
  }

}
