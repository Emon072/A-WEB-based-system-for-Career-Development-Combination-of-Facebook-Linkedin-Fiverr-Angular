import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';
import { CategoryInfo } from 'src/app/Models/category.model';
import { SubCatInfo } from 'src/app/Models/subcat.model';
import { WorkInfo } from 'src/app/Models/work.model';
import { CategoryService } from 'src/app/Service/category.service';
import { WorkService } from 'src/app/Service/work.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  @Output() sendMessageReciverEmitter = new EventEmitter<number>();
  @Output() sendProfileEmitter = new EventEmitter<number>();

  constructor(private workService:WorkService , private categoryService : CategoryService) { }

  demoSubCat : string[]  = [];
  subCatInfo : SubCatInfo = {
    CatID: 0,
    CatSub: ''
  }
  ngOnInit(): void {
    this.forCarosel();

    // set All Category
    this.setAllCategory();

    //get all work info
    this.getAllWorkInfo();
    
    // getAllsubCat
    this.getAllcatInfo();
  }

  catInfo : SubCatInfo[] = [];

  getAllcatInfo(){
    this.categoryService.getCategory().subscribe(data=>{
      this.catInfo = data;
      //console.log(this.catInfo);
    });
  }


  // -------------------------------- getting all work information -----------

  categoryList : CategoryInfo[] = [];

  demoCategory1 : CategoryInfo = {
    CategoryID: 0,
    CategoryIcon: '',
    CategoryName: '',
    CategoryVacancy: 0
  }
  demoCategory2 : CategoryInfo = {
    CategoryID: 0,
    CategoryIcon: '',
    CategoryName: '',
    CategoryVacancy: 0
  }
  demoCategory3 : CategoryInfo = {
    CategoryID: 0,
    CategoryIcon: '',
    CategoryName: '',
    CategoryVacancy: 0
  }
  demoCategory4 : CategoryInfo = {
    CategoryID: 0,
    CategoryIcon: '',
    CategoryName: '',
    CategoryVacancy: 0
  }
  demoCategory5 : CategoryInfo = {
    CategoryID: 0,
    CategoryIcon: '',
    CategoryName: '',
    CategoryVacancy: 0
  }
  demoCategory6 : CategoryInfo = {
    CategoryID: 0,
    CategoryIcon: '',
    CategoryName: '',
    CategoryVacancy: 0
  }
  demoCategory7 : CategoryInfo = {
    CategoryID: 0,
    CategoryIcon: '',
    CategoryName: '',
    CategoryVacancy: 0
  }
  demoCategory8 : CategoryInfo = {
    CategoryID: 0,
    CategoryIcon: '',
    CategoryName: '',
    CategoryVacancy: 0
  }
  
  setAllCategory(){

    this.demoCategory1.CategoryID  = 1;
    this.demoCategory1.CategoryIcon = "fa fa-laptop text-primary mb-4";
    this.demoCategory1.CategoryName = "PROGRAMMING";
    
    this.categoryList.push(this.demoCategory1);
    
    this.demoCategory2.CategoryID  = 2;
    this.demoCategory2.CategoryIcon = "fa fa-briefcase text-primary mb-4";
    this.demoCategory2.CategoryName = "BUSINESS";
    
    this.categoryList.push(this.demoCategory2);
    
    this.demoCategory3.CategoryID  = 3;
    this.demoCategory3.CategoryIcon = "fa fa-area-chart text-primary mb-4";
    this.demoCategory3.CategoryName = "GRAPHICS & DESIGN";
  
    this.categoryList.push(this.demoCategory3);

    this.demoCategory4.CategoryID  = 4;
    this.demoCategory4.CategoryIcon = "fa fa-3x fa-drafting-compass text-primary mb-4";
    this.demoCategory4.CategoryName = "DIGITAL MARKETING";

    this.categoryList.push(this.demoCategory4);

    this.demoCategory5.CategoryID  = 5;
    this.demoCategory5.CategoryIcon = "fa fa-video-camera text-primary mb-4";
    this.demoCategory5.CategoryName = "VIDEO & ANIMATION";

    this.categoryList.push(this.demoCategory5);


    this.demoCategory6.CategoryID  = 6;
    this.demoCategory6.CategoryIcon = "fa fa-3x fa-hands-helping text-primary mb-4";
    this.demoCategory6.CategoryName = "LIFESTYLE";

    this.categoryList.push(this.demoCategory6);

    this.demoCategory7.CategoryID  = 7;
    this.demoCategory7.CategoryIcon = "fa fa-pencil text-primary mb-4";
    this.demoCategory7.CategoryName = "WRITING & TRANSLATION";

    this.categoryList.push(this.demoCategory7);

    this.demoCategory8.CategoryID  = 8;
    this.demoCategory8.CategoryIcon = "fa fa-headphones text-primary mb-4";
    this.demoCategory8.CategoryName = "MUSIC & AUDIO";

    this.categoryList.push(this.demoCategory8);


  }

  myCatAvailable = new Map < string , number> ();

  AllWorkInfo : WorkInfo[] = [];
  getAllWorkInfo(){
    this.workService.getAllWork().subscribe(data=>{
      this.AllWorkInfo = data;
      for (var i = 0; i < this.AllWorkInfo.length ; i++){
        this.AllWorkInfo[i].WorkCatagory = this.AllWorkInfo[i].WorkCatagory.toUpperCase();
        this.AllWorkInfo[i].workSubCatagory = this.AllWorkInfo[i].workSubCatagory.toLowerCase();

        if (this.myCatAvailable.has(data[i].WorkCatagory)){
          var kk = this.myCatAvailable.get(data[i].WorkCatagory);
          if (kk!=undefined){
            kk+=1;
            this.myCatAvailable.set(data[i].WorkCatagory,kk);
          }
        }
        else {
          this.myCatAvailable.set(data[i].WorkCatagory,1);
        }
      }
      // console.log(this.myCatAvailable);
      // console.log(this.AllWorkInfo);
    });
  }
  // ------------------------------- this is for carosel section --------------

  forCarosel(){
    const obs$ = interval(3000);
    obs$.subscribe((d) =>{
      let carosel1 = document.getElementById('carosual1');
      carosel1?.classList.toggle('hide');
      let carosel2 = document.getElementById('carosual2');
      carosel2?.classList.toggle('hide');
    });
  }

  // --------------------------------- control the job section option --------------------
  changeToFormSection(){
    let fromSection = document.getElementById('form');
    fromSection?.classList.remove('hide');

    let mainSeciton = document.getElementById('main_section');
    mainSeciton?.classList.add('hide');

  }

  // ------------------------------ this is for category section --------------------------

  tittleOfMainCat : string = "";
  subCatList : string [] = [];

  gotoThisCategory(cat : CategoryInfo){
    let mainSeciton = document.getElementById('main_section');
    mainSeciton?.classList.add('hide');
    let cat_section= document.getElementById('show_cat');
    cat_section?.classList.remove('hide');


    this.tittleOfMainCat = cat.CategoryName;
    var s = this.catInfo[cat.CategoryID-1].CatSub;
    
    this.subCatList = JSON.parse(s);
   // console.log(this.subCatList);

  }

  
  demoWork : WorkInfo = {
    WorkID: 0,
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: 'https://www.nature.com/nature-index/article/image/5f605fbe17c63323315eb2e2',
    ProfileRating: 0,
    WorkTittle: '',
    WorkPicture: '',
    WorkRating: 0,
    WorkReview: 0,
    StartingMoney: 0,
    WorkSummery: '',
    WorkDetails: '',
    WorkCatagory: '',
    workSubCatagory: ''
  }



  // ------------------------------------------- this is for work details section -------------------------

  thisWorkInfo : WorkInfo = {
    WorkID: 0,
    ProfileID: 0,
    ProfileName: '',
    ProfilePicture: '',
    ProfileRating: 0,
    WorkTittle: '',
    WorkPicture: '',
    WorkRating: 0,
    WorkReview: 0,
    StartingMoney: 0,
    WorkSummery: '',
    WorkDetails: '',
    WorkCatagory: '',
    workSubCatagory: ''
  }

  gotoThisJob(work:WorkInfo){
    let job = document.getElementById('job_details');
    job?.classList.remove('hide');

    let mainSeciton = document.getElementById('main_section');
    mainSeciton?.classList.add('hide');
    let cat_section= document.getElementById('show_cat');
    cat_section?.classList.add('hide');
    
    this.thisWorkInfo = work;
  }

  // ------------------------------------------- Send message to This user -----------------------------
  sendMessage(num:number){
    this.sendMessageReciverEmitter.emit(num);
  }
  
  //------------------------------------------------ go to this profile -------------------------------
  gotoThisProfile(num : number){
    this.sendProfileEmitter.emit(num);
  }


}
