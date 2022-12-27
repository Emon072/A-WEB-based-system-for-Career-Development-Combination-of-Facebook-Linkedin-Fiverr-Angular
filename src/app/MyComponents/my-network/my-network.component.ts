import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProfileInfo } from 'src/app/Models/profile.model';
import { AboutService } from 'src/app/Service/about.service';
import { FollowService } from 'src/app/Service/follow.service';
import { ProfileService } from 'src/app/Service/profile.service';

@Component({
  selector: 'app-my-network',
  templateUrl: './my-network.component.html',
  styleUrls: ['./my-network.component.css']
})
export class MyNetworkComponent implements OnInit {

  @Output() sendMessageReciverEmitter = new EventEmitter<ProfileInfo>();
  @Output() sendProfileEmitter = new EventEmitter<ProfileInfo>();

  constructor(private profileService : ProfileService,private cookieSerive : CookieService,private followService:FollowService, private aboutService: AboutService ) { }
  profileInfo : ProfileInfo[] = []

  thisPersonProfile : ProfileInfo = {
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: '',
    ProfileCoverPhoto: '',
    ProfileBio: ''
  }

  userID :number = 0;
  currentSkillCount = 0;

  ngOnInit(): void {
    var demo = this.cookieSerive.get('loginID');
      var id = Number(demo);
      this.userID = id;
    // getAllprofileInfo
    this.getAllprofileInfo();
    // getALlTheFollowersOfThisUser
    this.getAllFollowersOfThisUser(this.userID);
  }

  getAllprofileInfo() {
    this.profileService.getAllProfile().subscribe(data=>{
      
      var demo = this.cookieSerive.get('loginID');
      var id = Number(demo);
      this.userID = id;
      for (var i=0; i<data.length;i++){
        if (data[i].ProfileID!=id){
          this.profileInfo?.push(data[i]);
          this.getAboutInfoOfUser(data[i].ProfileID);
        }
        else {
          this.thisPersonProfile = data[i];
        }
      }
    });
  }

  // send new messageSenderProfile
  sendMessageReceiverProfile(profile:ProfileInfo){
    this.sendMessageReciverEmitter.emit(profile);
  }

  // this is for geting or followers of this user
  myMapfollow = new Map<number, number>();
  getAllFollowersOfThisUser(userId:number){
    this.followService.getAllfollowersOfThisUser(userId).subscribe(data=>{
      for (var i in data){
        this.myMapfollow.set(Number(data[i]),1);
      }
    });
  }
  
  addnewFollerList(userID:number, id:number){
    this.followService.addNewFollowerInTheList(userID,id).subscribe(data=>{
      this.getAllFollowersOfThisUser(this.userID);
    });
  }

  // careatenew Follower
  createNewFollowers(profile:ProfileInfo){
    this.addnewFollerList(this.userID,profile.ProfileID);
  }

  myMapLocation = new Map< number , string>();
  myMapSkill = new Map < number , string[]>();

  
  // getAboutInfo of the user
  getAboutInfoOfUser(id:number){
    var skillArr = [""];

    this.aboutService.getAbout(id).subscribe(data=>{
      this.myMapLocation.set(id,data[0].Location);
      var s = data[0].skill;

      var myMap = new Map < number, string > ();
      this.setMapValue(myMap);


      var demos ="";
      for (var i =0; i<s.length; i++){
        if (s[i]==' '){
          var k:number = Number(demos);
          var skill= myMap.get(k) as string;

          if (skill!=undefined){
            skillArr.push(skill);
          }

          demos = "";
        }
        else {
          demos+= s[i];
        }
      }
      if (demos.length){
        var k = Number(demos);
        var skill= myMap.get(k) as string;

        if (skill!=undefined){
          skillArr.push(skill);
        }

      }
      //console.log(skillArr);
      this.myMapSkill.set(id,skillArr);
      //console.log(this.myMapSkill);
      
    });
    
  }


  setMapValue (myMap : Map<number,String>){
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



  // -------------------------------------- go to profile of this user --------------------------
  goToProfile(profile : ProfileInfo)
  {
    this.sendProfileEmitter.emit(profile);
  }

}
