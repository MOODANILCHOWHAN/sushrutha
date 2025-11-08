import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed/feed.component';
import { CreatePostCardComponent } from './create-post-card/create-post-card.component';
import { MyPostANdActivityComponent } from './my-post-and-activity/my-post-and-activity.component';
import { ResumeManagementComponent } from './resume-management/resume-management.component';
import { SinglePostCardComponent } from './single-post-card/single-post-card.component';



@NgModule({
  declarations: [
    FeedComponent,
    CreatePostCardComponent,
    MyPostANdActivityComponent,
    ResumeManagementComponent,
    SinglePostCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DemoModule { }
