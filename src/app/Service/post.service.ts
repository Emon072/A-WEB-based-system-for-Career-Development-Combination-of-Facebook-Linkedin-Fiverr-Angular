import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostInfo } from '../Models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  readonly APIUrl = "http://localhost:8000/post/";
  constructor(private http:HttpClient) { }

  getAllPostInfo() : Observable<PostInfo[]>{
    return this.http.get<PostInfo[]>(this.APIUrl);
  }

  addPostInfo(postInfo:PostInfo){
    return this.http.post(this.APIUrl,postInfo);
  }

  updatePostInfo (postInfo:PostInfo){
    return this.http.put(this.APIUrl,postInfo);
  }
  
}
