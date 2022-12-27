import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubCatInfo } from '../Models/subcat.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly APIUrl = "http://localhost:8000/category/";
  constructor(private http:HttpClient) { }

  getCategory(): Observable<SubCatInfo[]>{
    return this.http.get<SubCatInfo[]>(this.APIUrl);
  }
  addCategory(cat : SubCatInfo){
    return this.http.post(this.APIUrl, cat);
  }
  
}
