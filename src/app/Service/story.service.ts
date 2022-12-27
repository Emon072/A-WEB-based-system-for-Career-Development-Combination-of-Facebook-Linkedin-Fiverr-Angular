import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoryInfo } from '../Models/story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  readonly APIUrl = "http://localhost:8000/story/";
  constructor(private http:HttpClient) { }


  getAllStoryInfo() : Observable<StoryInfo[]>{
    return this.http.get<StoryInfo[]>(this.APIUrl);
  }

  addStoryInfo(postInfo:StoryInfo){
    return this.http.post(this.APIUrl,postInfo);
  }
}
