import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AboutInfo } from 'src/app/Models/about.model';
import { CommentInfo } from 'src/app/Models/comment.model';
import { LikeInfo } from 'src/app/Models/like.model';
import { LoginInfo } from 'src/app/Models/login.model';
import { PostInfo } from 'src/app/Models/post.model';
import { ProfileInfo } from 'src/app/Models/profile.model';
import { AboutService } from 'src/app/Service/about.service';
import { FollowService } from 'src/app/Service/follow.service';
import { LoginService } from 'src/app/Service/login.service';
import { PostService } from 'src/app/Service/post.service';
import { ProfileService } from 'src/app/Service/profile.service';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private loginService : LoginService,private followService:FollowService,private aboutService : AboutService, private cookieSerive : CookieService, private profileService:ProfileService , private postService : PostService) { }
  Banner_image = "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg";


  loginPersonID : number = 0;
  ngOnInit(): void {
    var demo = this.cookieSerive.get('loginID');
    var id = Number(demo);
    this.loginPersonID = id;

    this.ThisPersonProfileInfo = [];
    this.ThisPersonProfileInfo.push(this.demoProfileInfo);

    
  }


  myMapfollow = new Map<Number, number>();
  myMapSkill = new Map < Number, number>();
  AllPost:PostInfo [] = [];
  PostOfthisUser : PostInfo[] = [];
  ThisPersonProfileInfo : ProfileInfo[] = [];

  demoProfileInfo : ProfileInfo = {
    ProfileID: 0, 
    ProfileName: '',
    ProfilePicture: '',
    ProfileCoverPhoto: '',
    ProfileBio: ''
  }

  userId : number  = 0;
  userProfilePictre : string ="";
  userName : string = "";


  // this is for current page section option

  currentOption:Number = 1;


  userAboutInfo : AboutInfo[] = [];


  gotoThisUser(userID : number , follow : Map <Number, number> , skill : Map < Number , number > , post : PostInfo[]){
    
    this.AllPost = post;
    this.userId = userID;
    this.PostOfthisUser = [];

    this.getAllLoginInfo();

    this.myMapfollow = follow;

    this.profileService.getProfile(userID).subscribe(data=>{
      this.ThisPersonProfileInfo = data;
      this.userProfilePictre = data[0].ProfilePicture;
      this.userName = data[0].ProfileName;
      //console.log(this.ThisPersonProfileInfo);

      this.getAllUserPhotoList();
      this.setAboutInfoOfThisUser();
    });


    for (var i = post.length-1; i >= 0 ; i--){
      if (post[i].ProfileID == this.userId){
        
        post[i].PostLikeArray = JSON.parse(post[i].PostLikeList); 
        
        post[i].PostCommentArray = JSON.parse(post[i].PostCommentList);

        post[i].showLikeList  = 0;
        
        this.PostOfthisUser.push(post[i]);
      }
    }
    //console.log(this.PostOfthisUser);

    this.aboutService.getAbout(userID).subscribe(data=>{
      this.userAboutInfo = data;
    });
    

  }


  // ------------------- for post section -----------------------------
  datePipe: DatePipe = new DatePipe('en-US');
  getFormattedDate(date : Date){
    var transformDate = this.datePipe.transform(date, 'MMM d, y, h:mm a');
    return transformDate;
  }


  // -------------------------------- this is for like section ---------------------------
  demoLike : LikeInfo = {
    ProfileID: 0,
    ProfileImage: '',
    ProfileName: ''
  }

  addLike(likePost : PostInfo , idx : number){
    var flag = true;
    var k : number = 0;

    for (var i = 0; i < likePost.PostLikeArray.length ; i++){
      if (this.userId == likePost.PostLikeArray[i].ProfileID){
        k = i;
        flag = false;
      }
    }

    if (flag){
      this.demoLike.ProfileID = this.userId;
      this.demoLike.ProfileImage = this.userProfilePictre;
      this.demoLike.ProfileName = this.userName;

      this.PostOfthisUser[idx].PostLikeArray.push(this.demoLike);
      likePost.PostLikeCnt  = this.PostOfthisUser[idx].PostLikeCnt;
      // this.PostOfthisUser[idx].PostLikeArray = [];
      this.PostOfthisUser[idx].PostLikeCnt = 1;

      likePost.PostLikeList = JSON.stringify(this.PostOfthisUser[idx].PostLikeArray);
      
      this.postService.updatePostInfo(likePost).subscribe(data=>{
       
      });
    }
    else {
      this.PostOfthisUser[idx].PostLikeCnt = 0;
      if (k>0)
        this.PostOfthisUser[idx].PostLikeArray.splice(k, 1);
      likePost.PostLikeList = JSON.stringify(this.PostOfthisUser[idx].PostLikeArray);
      this.postService.updatePostInfo(likePost).subscribe(data=>{
       
      });
    }
  }

  // show like list of this user
  show_liked_list(idx : number){
    this.PostOfthisUser[idx].showLikeList++;
    this.PostOfthisUser[idx].showLikeList%=2; 
  }


  // -------------------------------- this is for comment section -------------------------

  demoComment : CommentInfo = {
    ProfileID: 0,
    ProfileImage: '',
    CommentDate: new Date,
    comment: '',
    ProfileName: ''
  }
  
  addComment(commentPostInfo : PostInfo, idx : number){
    
    //var commentList : CommentInfo[] = JSON.parse(commentPostInfo.PostCommentList) as CommentInfo[];
    this.demoComment.ProfileID = this.userId;
    this.demoComment.ProfileName = this.userName;
    this.demoComment.ProfileImage = this.userProfilePictre;
    this.demoComment.comment = this.PostOfthisUser[idx].tmpCommnetList;
    this.PostOfthisUser[idx].tmpCommnetList = "";
    this.demoComment.CommentDate = new Date;

    commentPostInfo.PostCommentArray.push(this.demoComment);

    commentPostInfo.PostCommentList =  JSON.stringify(commentPostInfo.PostCommentArray);
    
    this.postService.updatePostInfo(commentPostInfo).subscribe(data=>{
      console.log(data);
    });

  }


  // ---------------------------------------- cover photo changing section ----------------------------

  profileInfo : ProfileInfo = {
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: '',
    ProfileCoverPhoto: '',
    ProfileBio: ''
  }

  changeCoverPhoto(event : any){

    this.profileInfo = this.ThisPersonProfileInfo[0];
    var file=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile',file,file.name);

    //this.photoData = formData;

    var reader = new FileReader();
    reader.onload = (event:any) =>{
      //this.profileImage = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    this.profileService.addImage(formData).subscribe(data=>{
      this.profileInfo.ProfileCoverPhoto=data.toString();
      this.profileInfo.ProfileCoverPhoto=this.profileService.ImageUrl+this.profileInfo.ProfileCoverPhoto;

      this.profileService.updateProfile(this.profileInfo).subscribe(data=>{
        this.ThisPersonProfileInfo[0] = this.profileInfo;
      });
    });

  }

  // ----------------------------------------- get uploaded photo of this user ----------------------
  userPhotoList : string[] = [];

  getAllUserPhotoList(){

    this.userPhotoList = [];
    console.log(this.ThisPersonProfileInfo);
    if (this.ThisPersonProfileInfo[0].ProfilePicture.length){
      this.userPhotoList.push(this.ThisPersonProfileInfo[0].ProfilePicture);
    }
    if (this.ThisPersonProfileInfo[0].ProfileCoverPhoto.length){
      this.userPhotoList.push(this.ThisPersonProfileInfo[0].ProfileCoverPhoto);
    }

    for (var i = 0; i < this.PostOfthisUser.length ; i++){
      if (this.PostOfthisUser[i].PostImage.length)
        this.userPhotoList.push(this.PostOfthisUser[i].PostImage);
    }

    //console.log(this.userPhotoList);
  }


  // -------------------------- navigate through the all the pages -------------------------
  changeToFollow(){
    this.removeAllActiveLogo();
    let followers = document.getElementById('follow');
    followers?.classList.add('active');

    let followList = document.getElementById('follow_list');
    followList?.classList.remove('hide');
  }
  changeToTimeLine(){
    this.removeAllActiveLogo();
    let timeLine = document.getElementById('timeLine');
    timeLine?.classList.add('active');

    let feedList = document.getElementById('feedList');
    feedList?.classList.remove('hide');
  }

  changeToPhoto(){
    this.removeAllActiveLogo();
    let photoLogo = document.getElementById('photo_logo');
    photoLogo?.classList.add('active');
    
    let photo = document.getElementById('photo');
    photo?.classList.remove('hide');

  }

  changeToAbout(){
    this.removeAllActiveLogo();
    let aboutLogo = document.getElementById('about_logo');
    aboutLogo?.classList.add('active');
    let about = document.getElementById('about');
    about?.classList.remove('hide');
  }

  removeAllActiveLogo(){
    let timeLine = document.getElementById('timeLine');
    timeLine?.classList.remove('active');
    

    let followers = document.getElementById('follow');
    followers?.classList.remove('active');

    let feedList = document.getElementById('feedList');
    feedList?.classList.add('hide');

    let followList = document.getElementById('follow_list');
    followList?.classList.add('hide');

    let photoLogo = document.getElementById('photo_logo');
    photoLogo?.classList.remove('active');

    let photo = document.getElementById('photo');
    photo?.classList.add('hide');

    let aboutLogo = document.getElementById('about_logo');
    aboutLogo?.classList.remove('active');

    let about = document.getElementById('about');
    about?.classList.add('hide');
  }


  // ----------------------------------- this is for follow section ------------------------

  AllUserInfo : ProfileInfo[] = [];
  getAllLoginInfo(){
    this.profileService.getAllProfile().subscribe(data=>{
      this.AllUserInfo = data;
      this.getAllFollowersOfThisUser(this.userId);
    });
  }

  // this is for geting or followers of this user
  userMapfollow = new Map<number, number>();
  getAllFollowersOfThisUser(userId:number){
    this.userMapfollow.clear();

    this.followService.getAllfollowersOfThisUser(userId).subscribe(data=>{
      for (var i in data){
        this.userMapfollow.set(Number(data[i]),1);
      }
      
    });
  }


  //------------------------------------- this is for about section option control --------
  @ViewChild(AboutComponent) aboutComponent : any;
  setAboutInfoOfThisUser (){
    this.aboutComponent.getAboutOf(this.userId);
    this.aboutComponent.user_name = this.ThisPersonProfileInfo[0].ProfileName;
    this.aboutComponent.user_bio = this.ThisPersonProfileInfo[0].ProfileBio;
  }


  // -------------------------------------- this is for photo section ------------------

}
