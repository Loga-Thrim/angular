import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { RecaptchaModule } from 'ng-recaptcha'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MembersComponent } from './members/members.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormulaComponent } from './formula/formula.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MembersComponent,
    HomeComponent,
    RegisterComponent,
    AdminComponent,
    DashboardComponent,
    FormulaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RecaptchaModule.forRoot(),
    HttpClientModule,
    [RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'member',
        component: MembersComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'formula',
        component: FormulaComponent
      },
      {
        path: '**',
        component: HomeComponent
      }
    ])],
    RecaptchaModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
