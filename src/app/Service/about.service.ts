import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { AboutInfo } from '../Models/about.model';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  readonly APIUrl = "http://localhost:8000/about/";
  constructor(private http:HttpClient) { }

  getAbout(id:number): Observable<AboutInfo[]>{
    return this.http.get<AboutInfo[]>(this.APIUrl+id.toString());
  }

  createAbout(aboutInfo:AboutInfo){
    return this.http.post(this.APIUrl,aboutInfo);
  }

  updateAbout(aboutInfo:AboutInfo){
    return this.http.put(this.APIUrl,aboutInfo);
  }

}
