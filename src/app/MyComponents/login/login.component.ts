import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AboutInfo } from 'src/app/Models/about.model';
import { LoginInfo } from 'src/app/Models/login.model';
import { AboutService } from 'src/app/Service/about.service';
import { LoginService } from 'src/app/Service/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() loginSuccess = new EventEmitter<LoginInfo>();

  constructor(private loginService:LoginService, private aboutService:AboutService) { }

  loginInfo :LoginInfo[] = [];
  tmploginInfo: LoginInfo = {
    loginID: 0,
    EmailAddress: '',
    Password: ''
  }
  newRegister : boolean = false;

  ngOnInit(): void {
    this.refershAllLoginInfo();
  }


  // this will get all the loginInfo
  refershAllLoginInfo(){
    this.loginService.getAllLoginInfo().subscribe(response => {
      this.loginInfo = response;
      if (this.newRegister) {
        this.LoginFunction();
      }
    });
    
  }



  LoginFunction(){

    if (this.tmploginInfo.EmailAddress.length==0){
      alert("Please Enter the Email Address");
      return;
    }
    else if (this.tmploginInfo.Password.length==0){
      alert("Please Enter the Email Address");
      return;
    }

    var flag = true; var idx = 0;
    for (var i = 0; i < this.loginInfo.length; i++){
      if (this.loginInfo[i].EmailAddress==this.tmploginInfo.EmailAddress && this.tmploginInfo.Password== this.loginInfo[i].Password){
        flag = false;
        idx = i;
        break;
      }
    }
    if(flag){
      alert('Unsuccessful');
    }
    else {
      alert("successfull");
      if (this.newRegister){
        this.demoAboutInfo.ProfileID = this.loginInfo[idx].loginID;
        this.aboutService.createAbout(this.demoAboutInfo).subscribe(data=>{
          this.loginSuccess.emit(this.loginInfo[idx]);
        });
      }
      else {
        this.loginSuccess.emit(this.loginInfo[idx]);
      }
    }
  }


  demoAboutInfo : AboutInfo = {
    ProfileID: 0,
    Phone: 'Not Given',
    Profession: 'Not Given',
    Location: 'Not Given',
    Gender: 0,
    skill: 'Not Given'
  }
  signUpFunctionMain(){

    if (this.tmploginInfo.EmailAddress.length==0){
      alert("Please Enter the Email Address");
      return;
    }
    else if (this.tmploginInfo.Password.length==0){
      alert("Please Enter the Email Address");
      return;
    }

    var flag = true;
    for (var i = 0; i < this.loginInfo.length; i++){
      if (this.loginInfo[i].EmailAddress==this.tmploginInfo.EmailAddress){
        flag = false;
        break;
      }
    }

    if (!flag){
      alert("This Email Address is already in use");
    }
    else {
      this.loginService.addLoginInfo(this.tmploginInfo).subscribe(Response=>{
        this.newRegister = true;
        this.refershAllLoginInfo();
      })
    }
  }

  // this is for css section
  signInImage: string = "../../../../assets/img/log.svg";
  signUpImage: string = "../../../../assets/img/register.svg";

  signUpPage(){
    let demo = document.getElementsByClassName('container')[0];
    demo.classList.add("sign-up-mode");   
  }
  signInPage(){
    let body = document.getElementsByTagName('div')[0];
    body.classList.remove("sign-up-mode");
  }

}
