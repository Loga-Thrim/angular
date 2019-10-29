import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username: string = ""
  credit: string = ""
  email: string = ""

  constructor(private http:HttpClient, private router: Router) { }

  logout(){
    localStorage.removeItem("token")
    this.router.navigate(['/'])
  }

  ngOnInit() {
    this.http.get("/member", {
      observe: "body",
      params: new HttpParams().append('token', localStorage.getItem('token'))
    }).subscribe((result:any)=>{

      if(result.username == "wrong"){
        this.router.navigate(['/admin'])
      }
      this.username = result.username
      this.credit = result.credit
      this.email = result.email
    })
  }

}
