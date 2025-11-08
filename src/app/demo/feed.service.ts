// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class FeedService {

//   constructor() { }
// }




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Config } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient) { }

  getFeed(email) {
    return this.http.get<Config>(`${environment.JS_API}/feed/users/${email}`);
  }

  getFeedEmail(page,type) {
    return this.http.get<Config>(`${environment.JS_API}/feed/recommended?currentPage=${page}&filter=${type}`);
  }

  postFeed(data) {
    return this.http.post<Config>(`${environment.JS_API}/feed/`, data);
  }

  postFeedGroup(data) {
    return this.http.post<Config>(`${environment.JS_API}/group/groupfeeditem`, data);
  }

  commentOnPost(data, id) {
    return this.http.post<Config>(`${environment.JS_API}/feed/${id}/comment`, data);
  }

  companyCommentOnPost(data, id) {
    // return this.http.post<Config>(`${environment.JS_API}/feed/${id}/comment`, data);
  }

  savePost(id, status) {
    return this.http.put<Config>(`${environment.JS_API}/feed/${id}/save?status=${status}`, {});
  }

  hidePost(id) {
    return this.http.put<Config>(`${environment.JS_API}/feed/${id}/hidepost`, {});
  }

  getSavedPosts() {
    return this.http.get<Config>(`${environment.JS_API}/feed/allsavedfeeds`);
  }

  replayOnComment(data, id) {
    return this.http.post<Config>(`${environment.JS_API}/feed/${id}/comment/rly`, data);
  }

  likeComment(id, commentType) {
    return this.http.post<Config>(`${environment.JS_API}/feed/comment/${id}/like?type=${commentType}`, {});
  }

  likeReply(id, commentType) {
    return this.http.post<Config>(`${environment.JS_API}/feed/comment/${id}/like?type=${commentType}`, {});
  }

  likeCommentByCompany(id, commentType, cmpId, isCompany) {
    return this.http.post<Config>(`${environment.JS_API}/feed/comment/${id}/like?type=${commentType}&id=${cmpId}&cmp=${isCompany}`, {});
  }

  likeReplyByCompany(id, commentType, cmpId, isCompany) {
    return this.http.post<Config>(`${environment.JS_API}/feed/comment/${id}/like?type=${commentType}&id=${cmpId}&cmp=${isCompany}`, {});
  }

  likePost(id) {
    return this.http.post<Config>(`${environment.JS_API}/feed/${id}/like`, {});
  }

  companyLikePost(id, cmpId, type) {
    return this.http.post<Config>(`${environment.JS_API}/feed/${id}/like?id=${cmpId}&isCmp=${type}`, {});
  }

  showWhoLikedList(id, page) {
    return this.http.get<Config>(`${environment.JS_API}/feed/${id}/like?currentPage=${page}`);
  }

  showWhoSharedList(id, page) {
    return this.http.get<Config>(`${environment.JS_API}/feed/${id}/share?currentPage=${page}`);
  }

  showWhoLikedCommentList(id, page) {
    return this.http.get<Config>(`${environment.JS_API}/feed/comment/${id}/like?currentPage=${page}`);
  }

  showWhoLikedReplyList(id, page) {
    return this.http.get<Config>(`${environment.JS_API}/feed/rly/${id}/like?currentPage=${page}`);
  }

  sharePost(id, data) {
    return this.http.post<Config>(`${environment.JS_API}/feed/${id}/share`, data);
  }

  getTagSugetions(text) {
    return this.http.get<Config>(`${environment.JS_API}/connections/userhashtagsuggestions?s=${text}&page=1`);
  }

  createHashTag(data) {
    return this.http.post<Config>(`${environment.JS_API}/connections/hashtag`, data);
  }

  updateFeedItem(data) {
    return this.http.put<Config>(`${environment.JS_API}/feed/`, data);
  }

  editComment(data) {
    return this.http.put<Config>(`${environment.JS_API}/feed/comments?type=rootComment`, data);
  }

  editReplay(data) {
    return this.http.put<Config>(`${environment.JS_API}/feed/comments?type=replyComment`, data);
  }

  updateWhoCanComment(id, value) {
    return this.http.put<Config>(`${environment.JS_API}/feed/${id}/commentStatus?commentVisibility=${value}`, {});
  }

  getContactInvitation(id) {
    return this.http.get<Config>(`${environment.JS_API}/contacts?id=${id}`);
  }
  acceptInvitation(email) {
    return this.http.get<Config>(`${environment.JS_API}/connections/accept-invitation?target=${email}`);
  }
  downloadUploadedDocument(feedItemId:number) {
    return this.http.get<Blob>(`${environment.JS_API}/feed/download/${feedItemId}`,{ responseType: 'blob' as 'json' });
  }

}
