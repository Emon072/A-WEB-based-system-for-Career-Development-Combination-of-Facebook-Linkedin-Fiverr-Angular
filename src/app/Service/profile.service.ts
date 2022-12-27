import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileInfo } from '../Models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  readonly APIUrl = "http://localhost:8000/profile/";
  readonly ImageUrl = "http://localhost:8000/media/";
  constructor(private http:HttpClient) { }


  getProfile(id:number): Observable<ProfileInfo[]>{
    return this.http.get<ProfileInfo[]>(this.APIUrl+id.toString());
  }

  addProfile(profileInfo:ProfileInfo){
    return this.http.post(this.APIUrl,profileInfo);
  }

  updateProfile(ProfileInfo:ProfileInfo){
    return this.http.put(this.APIUrl,ProfileInfo);
  }

  addImage(val : any){
    return this.http.post("http://localhost:8000/SaveFile",val);
  }

  // getAll the profile
  getAllProfile(): Observable<ProfileInfo[]>{
    return this.http.get<ProfileInfo[]>(this.APIUrl);
  }

}
