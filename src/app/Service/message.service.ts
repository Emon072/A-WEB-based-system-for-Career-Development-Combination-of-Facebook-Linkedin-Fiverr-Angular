import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { MessageInfo } from '../Models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  readonly APIUrl = "http://localhost:8000/message/";

  constructor(private http:HttpClient) { }

  getAllMessageOfThisUser(sender:number,receiver:number): Observable<MessageInfo[]>{
    return this.http.get<MessageInfo[]>(this.APIUrl+sender.toString()+"/"+receiver.toString()+"/");
  }
  getAllNewMessageOfThisUser(sender:number){
    return this.http.get<MessageInfo[]>(this.APIUrl+sender.toString()+"/");
  }

  addMessage(messageInfo:MessageInfo, sender:number,receiver:number){
    return this.http.post(this.APIUrl+sender.toString()+"/"+receiver.toString()+"/",messageInfo);
  }

  getAllMessageListOfThisUser(sender:number,receiver:number): Observable<MessageInfo[]>{
    return this.http.get<MessageInfo[]>(this.APIUrl+sender.toString()+"/"+receiver.toString()+"/");
  }

  deleteMessageOfuser(sender:number) {
    return this.http.delete(this.APIUrl+sender.toString());
  }

}
