import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostInfo } from '../Models/post.model';
import { WorkInfo } from '../Models/work.model';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  readonly APIUrl = "http://localhost:8000/work/";
  constructor(private http:HttpClient) { }

  getAllWork() : Observable<WorkInfo[]>{
    return this.http.get<WorkInfo[]>(this.APIUrl);
  }
  
  addWork(work:WorkInfo){
    return this.http.post(this.APIUrl,work);
  }
}
