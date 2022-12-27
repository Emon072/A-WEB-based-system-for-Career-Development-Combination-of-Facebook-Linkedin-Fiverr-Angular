import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProfileInfo } from 'src/app/Models/profile.model';
import { WorkInfo } from 'src/app/Models/work.model';
import { ProfileService } from 'src/app/Service/profile.service';
import { WorkService } from 'src/app/Service/work.service';

@Component({
  selector: 'app-work-form',
  templateUrl: './work-form.component.html',
  styleUrls: ['./work-form.component.css']
})
export class WorkFormComponent implements OnInit {

  constructor(private cookieService : CookieService , private profileService:ProfileService , private workService : WorkService) { }

  demoWork : WorkInfo = {
    WorkID: 0,
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: '',
    ProfileRating: 0.0,
    WorkTittle: '',
    WorkPicture: 'https://www.nature.com/nature-index/article/image/5f605fbe17c63323315eb2e2',
    WorkRating: 0.0,
    WorkReview: 0,
    StartingMoney: 0,
    WorkSummery: '',
    WorkDetails: '',
    WorkCatagory: '',
    workSubCatagory: ''
  }
  allClearWork: WorkInfo = {
    WorkID: 0,
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: '',
    ProfileRating: 0,
    WorkTittle: '',
    WorkPicture: 'https://www.nature.com/nature-index/article/image/5f605fbe17c63323315eb2e2',
    WorkRating: 0,
    WorkReview: 0,
    StartingMoney: 0,
    WorkSummery: '',
    WorkDetails: '',
    WorkCatagory: '',
    workSubCatagory: ''
  }

  userId : number = 0;
  ngOnInit(): void {
    var demo = this.cookieService.get('loginID');
    var id = Number(demo);
    this.userId = id;
    this.getProfileInfoMation();
  }

  checkTheSubmitValue(){
    
    // console.log(this.tittlepicture);
    // console.log(this.demoWork);
    
    if (this.isImageSelcted){
      const formData = this.tittlepicture;
      this.profileService.addImage(formData).subscribe(data=>{
        this.demoWork.WorkPicture = data.toString();
        this.demoWork.WorkPicture = this.profileService.ImageUrl + this.demoWork.WorkPicture;
       
        this.workService.addWork(this.demoWork).subscribe(data=>{
          alert("Work uploaded succesfully");
          this.demoWork = this.allClearWork;
        });
        
      });
    }
    else {

    }

  }

  // -------------------- this will get all the profile informtaion ----------=
  thisUserProfileInfo:ProfileInfo[] = [];
  getProfileInfoMation(){
    this.profileService.getProfile(this.userId).subscribe(data=>{
      this.thisUserProfileInfo = data;

      this.demoWork.ProfileID = data[0].ProfileID;
      this.demoWork.ProfileName = data[0].ProfileName;
      this.demoWork.ProfilePicture = data[0].ProfilePicture;

    });
  }

  // ------------------------- this is for work title image section ---------------------------
  isImageSelcted : number = 0;
  tittlepicture : any;
  handlerFileInput(event:any){
    var file=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile',file,file.name);

    this.tittlepicture = formData;

    var reader = new FileReader();
    reader.onload = (event:any) =>{
      this.isImageSelcted = 1;
      this.demoWork.WorkPicture = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    
  }

}
