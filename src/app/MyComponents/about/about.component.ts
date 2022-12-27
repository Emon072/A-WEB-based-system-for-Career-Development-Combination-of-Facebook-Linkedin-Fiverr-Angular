import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AboutInfo } from 'src/app/Models/about.model';
import { AboutService } from 'src/app/Service/about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  dropdownList :any= [];
  dropdownSettings:any = [];
  form!: FormGroup;

  user_id: number = 0;

  user_name : string = "";
  user_bio : string = "";
  
  loginPesongID : number = 0;
  constructor(private formBuilder : FormBuilder, private cookieSerive : CookieService, private aboutService:AboutService ){
    var demo = this.cookieSerive.get('loginID');
    this.loginPesongID = Number(demo);
  }

  getAboutOf (num : number){
    this.user_id = num;
    this.getAboutInfoOfThisUser(this.user_id);
  }


  ngOnInit(){
    this.initForm();
    this.dropdownList = this.getData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All'
    };
  }

  initForm(){
    this.form = this.formBuilder.group({
      grocery : ['',[Validators.required]]
    })
  }

  handleButtonClick(){
    //console.log('reactive form value ', this.form.value);
    //console.log('Actual data ', this.getObjectListFromData(this.form.value.grocery.map((item: { item_id: any; }) => item.item_id)));
    
    this.SelectSkillUpdate++;
    this.SelectSkillUpdate%=2;
    if (this.SelectSkillUpdate==0){
      var result = this.getObjectListFromData(this.form.value.grocery.map((item: { item_id: Number; }) => item.item_id));
      var final = "";
      //console.log(result);
      for (var i = 0; i<result.length; i++){
        var num = result[i].item_id;
        final+= num.toString();
        final+=" ";
      }

      this.demoAboutInfo.skill = final;
      
      this.demoAboutInfo.ProfileID = this.user_id;
      this.aboutService.updateAbout(this.demoAboutInfo).subscribe(data=>{
        this.getAboutInfoOfThisUser(this.demoAboutInfo.ProfileID);
      });
    }
  }

  onItemSelect($event: any){
    //console.log('$event is ', $event); 
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

  setDefaultSelection(){
    let item = this.getData()[0];
    this.form.patchValue({
      grocery : [{
        item_id : item['item_id'],
        item_text : item['item_text']
      }]  
    })
  }
  EamilUpdate = 0;
  NameUpdate = 0;
  PhoneUpdate = 0;
  ProfessionUpdate = 0;
  LocationUpdate = 0;
  GenderUpdate = 0;
  SelectSkillUpdate = 0;

  // this is for phone number update
  PhoneNumberUpdate(){
    this.PhoneUpdate++;
    this.PhoneUpdate%=2;
    if (!this.PhoneUpdate){
      this.demoAboutInfo.ProfileID = this.user_id;
      this.aboutService.updateAbout(this.demoAboutInfo).subscribe(data=>{
        this.getAboutInfoOfThisUser(this.demoAboutInfo.ProfileID);
      });
    }
  }

  // this is for Location update
  LocationUpdateFunction(){
    this.LocationUpdate++;
    this.LocationUpdate%=2;
    if (!this.LocationUpdate){
      this.demoAboutInfo.ProfileID = this.user_id;
      this.aboutService.updateAbout(this.demoAboutInfo).subscribe(data=>{
        this.getAboutInfoOfThisUser(this.demoAboutInfo.ProfileID);
      });
    }
  }

  // this is for profession update 
  ProfessionUpdateFunction(){
    this.ProfessionUpdate++;
    this.ProfessionUpdate%=2;
    if (!this.ProfessionUpdate){
      this.demoAboutInfo.ProfileID = this.user_id;
      this.aboutService.updateAbout(this.demoAboutInfo).subscribe(data=>{
        this.getAboutInfoOfThisUser(this.demoAboutInfo.ProfileID);
      });
    }
  }


  // this will control the input section of the array
  aboutInfo: AboutInfo[] = [];
  demoAboutInfo : AboutInfo = {
    ProfileID: 0,
    Phone: 'Not Given',
    Profession: 'Not Given',
    Location: 'Not Given',
    Gender: 0,
    skill: 'Not Given'
  }

  showSkill : string ="";

  getAboutInfoOfThisUser(num:number){
    this.aboutService.getAbout(num).subscribe(data=>{
      this.aboutInfo = data;
      // console.log(this.aboutInfo);
      this.demoAboutInfo = this.aboutInfo[0];
      //console.log(this.demoAboutInfo);

      var myMap = new Map < number, string > ();
      this.setMapValue(myMap);
      
      var skill ="";
      var demos ="";
      for (var i =0; i<this.demoAboutInfo.skill.length; i++){
        if (this.demoAboutInfo.skill[i]==' '){
          var k = Number(demos);
          skill+= myMap.get(k);
          skill+=" ";
          demos = "";
        }
        else {
          demos+= this.demoAboutInfo.skill[i];
        }
      }
      if (demos.length){
        var k = Number(demos);
        skill+= myMap.get(k);
      }
      this.showSkill = skill;

    });
  }


}
