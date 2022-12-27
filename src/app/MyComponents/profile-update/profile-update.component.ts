import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProfileInfo } from 'src/app/Models/profile.model';
import { ProfileService } from '../../Service/profile.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {

  @Output() profileUpdateSuccess = new EventEmitter<number>();

  constructor(private cookieSerive : CookieService, private profileService : ProfileService) { }

  profileInfo : ProfileInfo = {
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: '',
    ProfileCoverPhoto: '',
    ProfileBio: ''
  }
  email : any;

  photoData : any;

  ngOnInit(): void {
    var demo = this.cookieSerive.get('loginID');
    this.email = this.cookieSerive.get('EmailAddress');
    var id = Number(demo);
    this.profileInfo.ProfileID = id;
  }

  uploadPhoto(event:any){
    var file=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile',file,file.name);

    this.photoData = formData;

    var reader = new FileReader();
    reader.onload = (event:any) =>{
      this.profileImage = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    
  }

  saveProfileInDatabase(){
    const formData = this.photoData;
    this.profileService.addImage(formData).subscribe((data:any)=>{
      this.profileInfo.ProfilePicture=data.toString();
      this.profileInfo.ProfilePicture=this.profileService.ImageUrl+this.profileInfo.ProfilePicture;
      this.profileService.addProfile(this.profileInfo).subscribe(data =>{
        alert("Profile Updated successfully please update your about section ");
        this.profileUpdateSuccess.emit(1);
      });
    })
  }
  // 
  profileImage: string = "../../../../assets/img/profile.png";
}
