import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { LoginInfo } from '../Models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly APIUrl = "http://localhost:8000/login/";

  constructor(private http:HttpClient) { }

  getAllLoginInfo() : Observable<LoginInfo[]>{
    return this.http.get<LoginInfo[]>(this.APIUrl);
  }

  addLoginInfo(loginInfo:LoginInfo){
    return this.http.post(this.APIUrl,loginInfo);
  }

}
