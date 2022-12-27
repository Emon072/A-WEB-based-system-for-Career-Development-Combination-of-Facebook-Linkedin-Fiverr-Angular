import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './MyComponents/login/login.component';
import { HomeComponent } from './MyComponents/home/home.component';
import { CookieService } from 'ngx-cookie-service';
import { ProfileUpdateComponent } from './MyComponents/profile-update/profile-update.component';
import { MyNetworkComponent } from './MyComponents/my-network/my-network.component';
import { ProfileComponent } from './MyComponents/profile/profile.component';
import { AboutComponent } from './MyComponents/about/about.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobsComponent } from './MyComponents/jobs/jobs.component';
import { WorkFormComponent } from './MyComponents/work-form/work-form.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileUpdateComponent,
    MyNetworkComponent,
    ProfileComponent,
    AboutComponent,
    JobsComponent,
    WorkFormComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
