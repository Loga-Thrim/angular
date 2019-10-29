import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public member:String = null
  public member_menu:String = "ระบบสมาชิก"
  public navAccount:string = "/member"

  constructor(private http:HttpClient) { }

  hide = "nav"
  showMenu(){
    if(this.hide == "nav"){
      this.hide = ""
    } else{
      this.hide = "nav"
    }
  }

  ngOnInit() {
    this.http.get("/member", {
      observe: "body",
      params: new HttpParams().append('token', localStorage.getItem('token'))
    }).subscribe((result:any)=>{
      if(result.username){
        this.member = "สวัสดีคุณ "+result.username
        this.member_menu = "จัดการบัญชี"
        this.navAccount = "/dashboard"
      }
    })
  }
}
