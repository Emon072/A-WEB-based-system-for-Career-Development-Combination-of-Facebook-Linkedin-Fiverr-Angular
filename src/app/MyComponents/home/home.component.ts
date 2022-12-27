import { Component, Directive, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MessageInfo } from 'src/app/Models/message.model';
import { ProfileInfo } from 'src/app/Models/profile.model';
import { FollowService } from 'src/app/Service/follow.service';
import { MessageService } from 'src/app/Service/message.service';
import { PostService } from 'src/app/Service/post.service';
import { AboutService } from 'src/app/Service/about.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostInfo } from 'src/app/Models/post.model';
import { ProfileService } from 'src/app/Service/profile.service';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CommentInfo } from 'src/app/Models/comment.model';
import { LikeInfo } from 'src/app/Models/like.model';
import { StoryService } from 'src/app/Service/story.service';
import { StoryInfo } from 'src/app/Models/story.model';
import { ProfileComponent } from '../profile/profile.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Output() sendMessageReciverEmitter = new EventEmitter<ProfileInfo>();
  @Output() sendFromMessageListEmitter = new EventEmitter<MessageInfo>();
  @Output() logOutEmitter = new EventEmitter<string>();

  datePipe: DatePipe = new DatePipe('en-US');
  getFormattedDate(date : any){
    var transformDate = this.datePipe.transform(date, 'MMM d, y, h:mm a');
    return transformDate;
  }

  messageListOfThisUser : MessageInfo[] = []

  constructor(private storyService: StoryService, private profileService:ProfileService, private cookieSerive : CookieService,private messageService:MessageService,private followService:FollowService, private postService:PostService ,private aboutService : AboutService, private formBuilder : FormBuilder) { }

  userId = 1;
  userProfilePictre= "";
  userName= "";
  userGmail = "";

  profileInfo : ProfileInfo[] = [];
  profileNameMap  = new Map < number , string>();
  profileImageMap = new Map < number , string> ();

  ngOnInit(): void {

    

    this.userName = this.cookieSerive.get('ProfileName');
    this.userProfilePictre = this.cookieSerive.get('ProfilePicture');
    this.userGmail = this.cookieSerive.get('EmailAddress');

    var demo = this.cookieSerive.get('loginID');
    this.userId = Number(demo);
    
    // getALlTheFollowersOfThisUser
    this.getAllFollowersOfThisUser(this.userId);
    this.getAboutInfoOfThisUser(this.userId);
    this.getAllProfileInfo();

    // this is for geting all the post 

    

    // this is for getting skill info of this user
    


    // this is for the drop downlist
    this.initForm();
    this.dropdownList = this.getData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All'
    };

    // get ALl the story
    this.getStoryOfUser();

   
  }

  // this will get all the profile information from the database
  getAllProfileInfo(){
    this.profileService.getAllProfile().subscribe(data=>{
      this.profileInfo = data;
      for (var i = 0; i < data.length ; i++){
        this.profileNameMap.set(data[i].ProfileID, data[i].ProfileName);
        this.profileImageMap.set(data[i].ProfileID, data[i].ProfilePicture);
      }
    })
  }

  AllStoryInfo : StoryInfo[] = [];
  getStoryOfUser(){
    this.userStoryInfo = [];
    this.storyService.getAllStoryInfo().subscribe(data=>{
      this.AllStoryInfo = data;
      //console.log(this.AllStoryInfo);
      this.getThisUserStoryInfo();
    });
  }

  ToogleMe(){
    let subMenu = document.getElementById('subMenu');
    subMenu?.classList.toggle("open-menu");
  }

  reloadMessage(){
    this.messageService.getAllMessageListOfThisUser(this.userId,-2).subscribe(data=>{
      this.messageListOfThisUser = data;
      this.messageListOfThisUser.reverse();
    });
  }
  iAmTempForMessage = true;
  ToggleMessage(){
    let messageMenu = document.getElementById('subMessageFinal');
    messageMenu?.classList.toggle('subMessageFinal');
    let messageIcon = document.getElementById('messageActive');

    this.messageService.deleteMessageOfuser(this.userId).subscribe(data=>{
      console.log(data);
    })

    if (this.iAmTempForMessage){
      messageIcon?.classList.add('active');
      this.iAmTempForMessage = false;
      this.messageService.getAllMessageListOfThisUser(this.userId,-2).subscribe(data=>{
        this.messageListOfThisUser = data;
        this.messageListOfThisUser.reverse();
      });
    }
    else {
      this.iAmTempForMessage  = true;
      messageIcon?.classList.remove('active');
    }
  }

  profilePictureLogo: string = "../../../../assets/img/profile.png";
  settingLogo: string = "../../../../assets/img/setting.png";
  heloLogo : string = "../../../../assets/img/help.png";
  logoutLogo : string = "../../../../assets/img/logout.png";

  // this is the important section for later work
  // for changing the page
  
  currentPage : number = 0;

  changeToNotification(){
    this.currentPage = 1;
    this.removeAllActiveLogo();
    let myNotification = document.getElementById('myNetworkLogo');
    myNotification?.classList.add('active');
  }
  changeToHome(){
    this.currentPage = 0;
    this.removeAllActiveLogo();
    let home = document.getElementById('homeLogo');
    home?.classList.add('active');
  }
  changeToJob(){
    this.currentPage = 3;
    this.removeAllActiveLogo();
    let jobLogo = document.getElementById('jobLogo');
    jobLogo?.classList.add('active');
  }

  getToTheProfile(){
    this.currentPage  = 2;
    this.removeAllActiveLogo();
    
  }

  removeAllActiveLogo(){
    let home = document.getElementById('homeLogo');
    home?.classList.remove('active');
    let myNotification = document.getElementById('myNetworkLogo');
    myNotification?.classList.remove('active');
    let jobLogo = document.getElementById('jobLogo');
    jobLogo?.classList.remove('active');

    let show_profile = document.getElementById('profile_show');
    show_profile?.classList.add('hide');
  }

  // send messageReceiverProfile
  sendMessageReceiverProfile(profile:ProfileInfo){
    this.sendMessageReciverEmitter.emit(profile);
  }
  // this is from the job section
  sendMessageReceiverProfileJob(num:number){
    this.profileService.getProfile(num).subscribe(data=>{
      this.sendMessageReciverEmitter.emit(data[0]);
    });
  }

  // for messageList
  sendFromMessageList(message:MessageInfo){
    this.sendFromMessageListEmitter.emit(message);
  }

  // for newMessageNotification
  newMessage:Number = 0;
  currentMessageCount = 0;
  changeNewMessage(count:Number){
    this.newMessage  = count;
  }

  // this is for geting or followers of this user
  myMapfollow = new Map<Number, number>();
  followListOfThisUser : number[] = [];
  mapFollowTime = new Map< number , string>();
  getAllFollowersOfThisUser(userId:number){
    this.followService.getAllfollowersOfThisUser(userId).subscribe(data=>{
      for (var i in data){
        this.myMapfollow.set(Number(data[i]),1);
        this.followListOfThisUser.push(Number(data[i]));

        this.getActiveTime(Number(data[i]));
        
      }
      
      //console.log(this.myMapfollow);
    });
  }


  // this will store the skill of this user
  
  myMapSkill = new Map < Number, number>();
  // get About Info of this user
  getAboutInfoOfThisUser(id:number){
    this.aboutService.getAbout(id).subscribe(data=>{

      var s = data[0].skill;

      var demos ="";
      for (var i =0; i<s.length; i++){
        if (s[i]==' '){
          var k:number = Number(demos);
          this.myMapSkill.set(k,1);

          demos = "";
        }
        else {
          demos+= s[i];
        }
      }
      if (demos.length){
        var k = Number(demos);
        this.myMapSkill.set(k,1);

      }
      //console.log(this.myMapSkill);
      this.getAllPost();
    });
  }
  


  // ----------------------  This section is for Home Page Post section --------------------

  // this is for drop down refresh
  tmpDropDown : number = 0;

  // All Post Info
  AllPost:PostInfo [] = [];
  PostOfthisUser : PostInfo[] = [];

  getAllPost(){
    this.postService.getAllPostInfo().subscribe(data=>{
      //console.log(data);
      this.AllPost = data;
      this.PostOfthisUser= [];
      this.getThisUserAllPost();
      
    });
  }

  postMessage : string = "";
  checkPostMessage(){
    if (this.postMessage[this.postMessage.length-1]=='#'){
      let feed = document.getElementById('opacity_changed_id');
      feed?.classList.add('opacity_change');
      
      this.tmpDropDown++;
    }
  }

  recentPostTag : any[] = [];
  skillMap  = new Map < Number , string > ();
  getThisUserAllPost(){
    let diceEntries = new Set<any>();
    this.setMapValue(this.skillMap)
    for (var i =0 ; i < this.AllPost.length ; i++){
      var flag = false;
      var b = this.AllPost[i].PostTag.split(',').map(Number);
      for (var j=0; j<b.length ; j++){
        
        if (this.myMapSkill.has(Number(b[j]))){
          flag = true;
        }
      }

      if (this.myMapfollow.has(this.AllPost[i].ProfileID)){
        flag = true;
      }
      //console.log(this.AllPost[i].PostTag);

      if (flag){
        this.AllPost[i].showLikeList = 0;
        this.PostOfthisUser.push(this.AllPost[i]);
        for (var j= 0 ; j < b.length; j++){
          
          diceEntries.add(this.skillMap.get(Number(b[j])));
           
        }
      }
    }

    for (var i=0;i< this.PostOfthisUser.length-1;  i++){
      for (var j = i+1; j < this.PostOfthisUser.length ; j++){
        if (this.PostOfthisUser[i].PostDate<this.PostOfthisUser[j].PostDate){
          var tmp = this.PostOfthisUser[i];
          this.PostOfthisUser[i] = this.PostOfthisUser[j];
          this.PostOfthisUser[j] = tmp;
        }
      }
    }

    // this is for comment section and for like section
    for (var i =0 ; i < this.PostOfthisUser.length ; i++){
      if (this.PostOfthisUser[i].PostCommentList.length)
        this.PostOfthisUser[i].PostCommentArray = JSON.parse(this.PostOfthisUser[i].PostCommentList) ;
        this.PostOfthisUser[i].PostLikeArray = JSON.parse(this.PostOfthisUser[i].PostLikeList);

        for (var j = 0 ; j < this.PostOfthisUser[i].PostLikeArray.length ; j++){
          if (this.PostOfthisUser[i].PostLikeArray[j].ProfileID == this.userId){
            this.PostOfthisUser[i].PostLikeCnt = 1;
          }
        }
    }
    //console.log(this.PostOfthisUser);
    for (let currentNumber of diceEntries) {
      this.recentPostTag.push(currentNumber);  //Prints 1 2 3 4 5 6
   }
  }

  // -------------------- this is for skill selct drop down -------------------------//
  dropdownList :any= [];
  dropdownSettings:any = [];
  form!: FormGroup;

  initForm(){
    this.form = this.formBuilder.group({
      grocery : ['',[Validators.required]]
    })
  }

  demoPost: PostInfo = {
    PostID: 0,
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: '',
    PostDate: new Date,
    PostImage: '',
    PostMessage: '',
    PostLikeCnt: 0,
    PostLikeList: '',
    PostCommentCnt: 0,
    PostCommentList: '',
    PostTag: '',
    tmpCommnetList: '',
    tmpLikeList: '',
    PostCommentArray: [],
    PostLikeArray: [],
    showLikeList: 0
  }
  allClearPost : PostInfo= {
    PostID: 0,
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: '',
    PostDate: new Date,
    PostImage: '',
    PostMessage: '',
    PostLikeCnt: 0,
    PostLikeList: '',
    PostCommentCnt: 0,
    PostCommentList: '',
    PostTag: '',
    tmpCommnetList: '',
    tmpLikeList: '',
    PostCommentArray: [],
    PostLikeArray: [],
    showLikeList: 0
  }

  skillOfPost: number[] = [];
  handleButtonClick(){
    //console.log('reactive form value ', this.form.value);
    //console.log('Actual data ', this.getObjectListFromData(this.form.value.grocery.map((item: { item_id: any; }) => item.item_id)));
    
    var result = this.getObjectListFromData(this.form.value.grocery.map((item: { item_id: Number; }) => item.item_id));
    //console.log(result);
    for (var i = 0; i<result.length; i++){
      var num = result[i].item_id;
      this.skillOfPost.push(num);
    }
    

    // console.log(this.skillOfPost.toString());
    // var k = this.skillOfPost.toString();
    // var b = k.split(',').map(Number);
    // console.log(b.length);
    this.UploadPost();
  }

  conTainImage : number = 0;

  UploadPost(){
    this.demoPost.ProfileID = this.userId;
    this.demoPost.ProfileName = this.userName;
    this.demoPost.ProfilePicture = this.userProfilePictre;
    this.demoPost.PostCommentArray = [];
    this.demoPost.PostCommentArray.push(this.demoComment);
    this.demoPost.PostCommentList = JSON.stringify(this.demoPost.PostCommentArray);
    this.demoPost.PostCommentArray = [];

    this.demoPost.PostLikeArray = [];
    this.demoLike.ProfileID = -1;
    this.demoPost.PostLikeArray.push(this.demoLike);
    this.demoPost.PostLikeList = JSON.stringify(this.demoPost.PostLikeArray);
    this.demoPost.PostLikeArray = [];
    
    this.demoPost.PostDate = new Date;
    if (this.conTainImage){
      this.demoPost.PostMessage = this.postMessage;
      this.demoPost.PostTag = this.skillOfPost.toString();
      this.postMessage = "";

      const formData = this.photoData;
      this.profileService.addImage(formData).subscribe((data:any)=>{
        this.demoPost.PostImage=data.toString();
        this.demoPost.PostImage=this.profileService.ImageUrl+this.demoPost.PostImage;
        this.conTainImage = 0;

        
        this.postService.addPostInfo(this.demoPost).subscribe(data=>{
          console.log(data);
          this.getAllPost();
          this.demoPost = this.allClearPost;
        });

      });

    }
    else {
      this.demoPost.PostMessage = this.postMessage;
      this.demoPost.PostTag = this.skillOfPost.toString();
      this.postMessage = "";

      this.postService.addPostInfo(this.demoPost).subscribe(data=>{
        console.log(data);
        this.getAllPost();
        this.demoPost = this.allClearPost;
      });
    }
  }

  onItemSelect($event: any){
    //console.log('$event is ', $event); 
    this.tmpDropDown++;
    this.tmpDropDown%=2;

    let feed = document.getElementById('opacity_changed_id');
    feed?.classList.remove('opacity_change');

    this.postMessage+=$event.item_text+" ";
  }

  getObjectListFromData(ids: string | any[]){
    return this.getData().filter(item => ids.includes(item.item_id))
  }

  getData() : Array<any>{
    return [
      { item_id: 1, item_text: 'UI/UX', group : 'F' },
      { item_id: 2, item_text: 'DevOps', group : 'F' },
      { item_id: 3, item_text: 'Angular', group : 'F' },
      { item_id: 4, item_text: 'WordPress', group : 'F' },
      { item_id: 5, item_text: 'SEO', group : 'F' },
      { item_id: 6, item_text: 'Yoast', group : 'F' },
      { item_id: 7, item_text: 'Photoshop', group : 'F' },
      { item_id: 8, item_text: 'Acrobat', group : 'F' },
      { item_id: 9, item_text: 'Java', group : 'F' },
      { item_id: 10, item_text: 'SQL', group : 'F' },
      { item_id: 11, item_text: 'System adminstration', group : 'F' },
      { item_id: 12, item_text: 'PHP', group : 'F' },
      { item_id: 13, item_text: 'Network Configuration', group : 'F' },
      { item_id: 14, item_text: 'Security', group : 'F' },
      { item_id: 15, item_text: 'Cisco', group : 'F' },
      { item_id: 16, item_text: 'Cloud Management', group : 'F' },
      { item_id: 17, item_text: 'Web Development', group : 'F' },
      { item_id: 18, item_text: 'Machine Learning', group : 'F' },
      { item_id: 19, item_text: 'Data Structures', group : 'F' },
      { item_id: 20, item_text: 'C++', group : 'F' },
      { item_id: 21, item_text: 'C', group : 'F' },
      { item_id: 22, item_text: 'C#', group : 'F' },
      { item_id: 23, item_text: 'JavaScript', group : 'F' }
    ];
  }

  setMapValue (myMap : Map<Number,String>){
    myMap.set(1,'UI/UX');
    myMap.set(2,'DevOps');
    myMap.set(3,'Angular');
    myMap.set(4,'WordPress');
    myMap.set(5,'SEO');
    myMap.set(6,'Yoast');
    myMap.set(7,'Photoshop');
    myMap.set(8,'Acrobat');
    myMap.set(9,'Java');
    myMap.set(10,'SQL');
    myMap.set(11,'System adminstration');
    myMap.set(12,'PHP');
    myMap.set(13,'Network Configuration');
    myMap.set(14,'Security');
    myMap.set(15,'Cisco');
    myMap.set(16,'Cloud Management');
    myMap.set(17,'Web Development');
    myMap.set(18,'Machine Learning');
    myMap.set(19,'Data Structures');
    myMap.set(20,'C++');
    myMap.set(21,'C');
    myMap.set(22,'C#');
    myMap.set(23,'JavaScript');

  }

  setDefaultSelection(){
    let item = this.getData()[0];
    this.form.patchValue({
      grocery : [{
        item_id : item['item_id'],
        item_text : item['item_text']
      }]  
    })
  }


  photoData : any;
  // post image section 
  handlerFileInputPost(event:any){
    var file=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile',file,file.name);

    this.photoData = formData;

    var reader = new FileReader();
    reader.onload = (event:any) =>{
      //this.profileImage = event.target.result;
      alert("image selected successfully");
      this.conTainImage = 1;
    }
    reader.readAsDataURL(event.target.files[0]);
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
      //console.log(data);
    });

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
  show_liked_list(idx:number){
    this.PostOfthisUser[idx].showLikeList++;
    this.PostOfthisUser[idx].showLikeList%=2; 
  }


  // -----------------------------------handlerFileInputStory -------------------------
  storyData : any;
  demoStory : StoryInfo = {
    StoryID: 0,
    ProfileID: this.userId,
    ProfileName: this.userName,
    ProfilePicture: this.userProfilePictre,
    StoryDate: new Date,
    StoryImage: ''
  }

  handlerFileInputStory(event:any){

    var file=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile',file,file.name);

    this.photoData = formData;

    var reader = new FileReader();
    reader.onload = (event:any) =>{
      //this.profileImage = event.target.result;
      alert("image selected successfully");
      
    }
    reader.readAsDataURL(event.target.files[0]);

    this.profileService.addImage(formData).subscribe((data:any)=>{
      this.demoStory.ProfileID = this.userId;
      this.demoStory.ProfilePicture = this.userProfilePictre;
      this.demoStory.ProfileName = this.userName;
      this.demoStory.StoryImage=data.toString();
      this.demoStory.StoryImage=this.profileService.ImageUrl+this.demoStory.StoryImage;
      //console.log(this.demoStory);
      this.storyService.addStoryInfo(this.demoStory).subscribe(data=>{
        //console.log(data);
        this.getStoryOfUser();
      });

    });

  }

  userStoryInfo : StoryInfo[] = [];

  getThisUserStoryInfo(){
    for( var i = 0; i < this.AllStoryInfo.length ; i++){
      var k = this.AllStoryInfo[i].ProfileID;
      var flag = false;
      if (k==this.userId) flag = true;
      if (this.myMapfollow.has(k)) flag = true;

      if (flag){
        this.userStoryInfo.push(this.AllStoryInfo[i]);
      }
    }
  }


  // ----------------------------- showing profile information ------------------------
  @ViewChild(ProfileComponent)  ChildComponent!: ProfileComponent;

  gotoThisUser(id : number){
    this.getToTheProfile();
    let show_profile = document.getElementById('profile_show');
    show_profile?.classList.remove('hide');
    this.ChildComponent.gotoThisUser(id , this.myMapfollow, this.myMapSkill , this.AllPost);
  }


  // --------------------------- this is for log out section -------------------------------

  logOut(){
    this.logOutEmitter.emit('1');
  }

  // ----------------------------- go to profile form my netwok section ----------------------
  sendToThisProfile(profile:ProfileInfo){
    this.gotoThisUser(profile.ProfileID);
  }
  sendToThisProfileJob(num:number){
    this.gotoThisUser(num);
  }


  // --------------------------- control the active status section --------------------------

  getActiveTime(num:number) {
    this.followService.getActiveStatuesOfUser(num).subscribe(data=>{
      
      //console.log(data[0].ActiveTime.toString());
      this.mapFollowTime.set(num,data[0].ActiveTime.toString());
    });
  }
}
