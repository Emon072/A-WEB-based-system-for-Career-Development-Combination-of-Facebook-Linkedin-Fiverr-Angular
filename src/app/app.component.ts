import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { LoginInfo } from './Models/login.model';
import { interval } from 'rxjs';
import { MessageService } from './Service/message.service';
import { MessageInfo } from './Models/message.model';
import { ProfileInfo } from './Models/profile.model';
import { ProfileService } from './Service/profile.service';
import { HomeComponent } from './MyComponents/home/home.component';
import { FollowService } from './Service/follow.service';
import { ActiveInfo } from './Models/active.model';
import { WorkService } from './Service/work.service';
import { LoginService } from './Service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(HomeComponent) ChildComponent: any;

  datePipe: DatePipe = new DatePipe('en-US');
  getFormattedDate(date : Date){
    var transformDate = this.datePipe.transform(date, 'MMM d, y, h:mm a');
    return transformDate;
  }

  userInfo : LoginInfo ={
    loginID: 0,
    EmailAddress: '',
    Password: ''
  }
  userProfileInfo: ProfileInfo[] =[];



  messageInfo : MessageInfo[] | undefined;

  demoMessage : MessageInfo = {
    MessageSenderID: 3,
    MessageReceiverID: 12,
    Message: '',
    MessageSenderProfilePicture: '',
    MessageReceiverProfilePicture: '',
    MessageSendDateTime: new Date(),
    MessageSenderName: '',
    MessageReceiverName: ''
  }


  ngOnInit(): void {
    var demo = this.cookieSerive.get('loginID');
    var id = Number(demo);
    if (id!=0){

      this.isLogIn = 1;
      this.userInfo.loginID = id;

      this.checkNewMessage();
      this.checkProfileInfo();
    }
    else {
      this.isLogIn= 0;
    }
  }


  title = 'mainSystem';

  constructor(private loginService : LoginService ,private cookieSerive : CookieService , private messageService: MessageService , private profileService:ProfileService, private followService:FollowService){}

  isLogIn:number = 0;

  loginUser(loginInfo : LoginInfo){
    this.isLogIn = 1;
    this.addUserLoginInfo(loginInfo);
    this.userInfo = loginInfo;
    //this is checking the new message is coming or not
    this.checkNewMessage();
    this.checkProfileInfo();
    // now add all this user login info in the cookie

    this.createNewActiveStatus();
  }

  createNewActiveStatus(){
    this.demoActive.ProfileID = this.userInfo.loginID;
    this.demoActive.ActiveTime = new Date();
    this.followService.createNewActiveStatus(this.userInfo.loginID,this.demoActive).subscribe(data=>{

    });
  }

  showProfileUpdate: boolean = true;
  // this for checking the profile information of the user
  checkProfileInfo(){
    this.profileService.getProfile(this.userInfo.loginID).subscribe(Response =>{
      this.userProfileInfo = Response;
      if (Response.toString() == 'false'){
        this.showProfileUpdate = true;
      }
      else {
        // console.log(this.userProfileInfo.ProfileName);
        this.showProfileUpdate = false;
        const dateNow = new Date();
        dateNow.setHours(dateNow.getHours()+1000);
        this.cookieSerive.set('ProfileName',this.userProfileInfo[0].ProfileName,dateNow);
        this.cookieSerive.set('ProfilePicture',this.userProfileInfo[0].ProfilePicture,dateNow);
      }
    });
  }

  addUserLoginInfo(loginInfo : LoginInfo){
    const dateNow = new Date();
    dateNow.setHours(dateNow.getHours()+1000);
    this.cookieSerive.set('loginID',loginInfo.loginID.toString(),dateNow);
    this.cookieSerive.set('EmailAddress',loginInfo.EmailAddress,dateNow);
  }

  userMessageList : MessageInfo[] | undefined;

  // now for realtime messageing functionality for checking new message is commming or not
  checkNewMessage(){

    const obs$ = interval(3000);
    obs$.subscribe((d) =>{
      if (0){
        let messageBox = document.getElementById('make_fixed_active');
        messageBox?.classList.add('none');
      }
      else {
        // for checking new message has come or not
        
        this.messageService.getAllNewMessageOfThisUser(Number(this.userInfo?.loginID)).subscribe(Response=>{
          
          let map  = new Map();
          for (var i=0; i<Response.length;i++){
            map.set(Response[i],1);
          }
          //console.log(map.size);
          if (this.userInfo.loginID>0)
            this.ChildComponent.changeNewMessage(map.size);
        });
        if (this.userInfo.loginID!=0){
          this.updateStatusOfUser();
        }
      }
    });
  }

  messageReceiverProfileInfo : ProfileInfo = {
    ProfileID: -1,
    ProfileName: 'Nothing',
    ProfilePicture: '',
    ProfileCoverPhoto: '',
    ProfileBio: ''
  }

  // profile time info for message.
  messageActiveTime : any;

  // messageSenderProfile 
  sendMessageReceiverProfile(profile:ProfileInfo){
    this.userMessageList = [];
    this.messageReceiverProfileInfo = profile;
    
    const obs$ = interval(1000);
    obs$.subscribe((d) =>{
      if (this.messageReceiverProfileInfo.ProfileID==-1){
        
      }
      else {
        let messageBox = document.getElementById('make_fixed_active');
        messageBox?.classList.remove('none');
        this.messageService.getAllMessageOfThisUser(Number(this.userInfo.loginID),Number(this.messageReceiverProfileInfo.ProfileID)).subscribe(data =>{
          this.userMessageList = data;
          this.scrollToBottom();
        });
        this.followService.getActiveStatuesOfUser(this.messageReceiverProfileInfo.ProfileID).subscribe(data=>{
          this.messageActiveTime = data[0].ActiveTime;
        })
      }
      
    });
  }
  // send new message 
  messageSend(){
 
    this.demoMessage.MessageSenderID = this.userInfo.loginID;
    this.demoMessage.MessageReceiverID = this.messageReceiverProfileInfo.ProfileID;
    this.demoMessage.MessageReceiverName = this.messageReceiverProfileInfo.ProfileName;
    this.demoMessage.MessageSenderName =this.userProfileInfo[0].ProfileName;
    this.demoMessage.MessageReceiverProfilePicture = this.messageReceiverProfileInfo.ProfilePicture;
    this.demoMessage.MessageSenderProfilePicture = this.userProfileInfo[0].ProfilePicture;
    console.log(this.demoMessage.MessageSenderProfilePicture);
    this.messageService.addMessage(this.demoMessage,Number(this.userInfo.loginID),Number(this.messageReceiverProfileInfo.ProfileID)).subscribe(response=>{
      // reload the messageList of the user
      this.ChildComponent.reloadMessage();
    });
  
    this.demoMessage.Message = '';
  }
  cancelMessage(){
    let messageBox = document.getElementById('make_fixed_active');
    messageBox?.classList.add('none');
    this.messageReceiverProfileInfo.ProfileID = -1;
  }
  ToggleMe(){
    let messageBox = document.getElementById('make_fixed_active');
    messageBox?.classList.toggle('active');
  }
  // try for scrolling
  @ViewChild('scrollMe')
  private myScrollCointer!: ElementRef;
  scrollToBottom():void{
    try{
      this.myScrollCointer.nativeElement.scrollTop = this.myScrollCointer?.nativeElement.scrollHeight;
    }catch(err){
    }
  }

  signInImage: string = "../../assets/img/profile.png";

  // controling the current page
  currentPage : number = 0;

  //----------------------------- do log out operation ---------------------
  DoLogOut(s : string){
    this.cookieSerive.deleteAll();
    this.showProfileUpdate = false;
    const dateNow = new Date();
    dateNow.setHours(dateNow.getHours()+1000);

    this.cookieSerive.set('loginID','0',dateNow);

    this.isLogIn = 0;
    this.userInfo.loginID = 0;
  }
  
  // send form messageList for new message
  sendFromMessageList(message:MessageInfo){
    if (message.MessageSenderID==this.userInfo.loginID){
      this.messageReceiverProfileInfo.ProfileID = message.MessageReceiverID;
      this.messageReceiverProfileInfo.ProfilePicture = message.MessageReceiverProfilePicture;
      this.messageReceiverProfileInfo.ProfileName = message.MessageReceiverName;
    }
    else {
      this.messageReceiverProfileInfo.ProfileID = message.MessageSenderID;
      this.messageReceiverProfileInfo.ProfileName = message.MessageSenderName;
      this.messageReceiverProfileInfo.ProfilePicture = message.MessageSenderProfilePicture;
    }

    this.sendMessageReceiverProfile(this.messageReceiverProfileInfo);
  }
  

  // get active status of specific user
  getActiveStatusOfUser(){
    this.followService.getActiveStatuesOfUser(5).subscribe(data=>{
      // no the next thing
    });
  }

  // updateActiveStatusOfaUser
  demoActive:ActiveInfo={
    ProfileID: 1,
    ActiveTime: new Date
  }; 
  updateStatusOfUser(){
    this.demoActive.ProfileID = this.userInfo.loginID;
    this.demoActive.ActiveTime = new Date;
    this.followService.updateActiveStatusOfUser(this.userInfo.loginID,this.demoActive).subscribe(data=>{
     // console.log(data);
    });
    //console.log("kjhjd");
  }


  // this is for geting or followers of this user
  follower_list:Array<string>= [];
  getAllFollowersOfThisUser(){
    this.followService.getAllfollowersOfThisUser(1).subscribe(data=>{
      this.follower_list = data;
      console.log(data);
    });
  }
  addnewFollerList(){
    this.followService.addNewFollowerInTheList(1,11).subscribe(data=>{
      console.log(data);
    });
  }



  // ---------------------------------------------- profile update succesfully ---------------------------
  updateSuccess(num : number){
    this.showProfileUpdate = false;
  }
}
