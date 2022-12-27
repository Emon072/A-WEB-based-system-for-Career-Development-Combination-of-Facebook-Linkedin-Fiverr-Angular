import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveInfo } from '../Models/active.model';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  readonly APIUrl = "http://127.0.0.1:8000/active/";
  readonly APIUrlFollow = "http://127.0.0.1:8000/follow/";

  constructor(private http:HttpClient) { }

  
  getActiveStatuesOfUser(id:number): Observable<ActiveInfo[]>{
    return this.http.get<ActiveInfo[]>(this.APIUrl+String(id));
  }
  updateActiveStatusOfUser(id:number, demo:ActiveInfo){
    return this.http.put(this.APIUrl+String(id),demo);
  }
  createNewActiveStatus(id:number,demo:ActiveInfo){
    return this.http.post(this.APIUrl+String(id),demo);
  }

  // this is for following section
  getAllfollowersOfThisUser(id:number):Observable<Array<string>>{
    return this.http.get<Array<string>>(this.APIUrlFollow+String(id));
  }
  addNewFollowerInTheList(id1:number, id2:number){
    return this.http.post(this.APIUrlFollow+String(id1)+"/"+String(id2),null);
  }
}
