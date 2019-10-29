import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router } from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  list_member = []

  data = []

  constructor(private http: HttpClient, private router: Router) { }

  update_credit(result:number, username:string){
    this.http.post<any>("/updatecredit", {username: username, credit: result}).subscribe(callback=>{
      if(callback.status == "success"){
        Swal.fire({
          type: "success",
          title: "เพิ่มเครดิตสำเร็จ"
        }).then(d=>{
          window.location.reload();
        })
      }
    })
  }

  logout(){
    localStorage.removeItem('token')
    this.router.navigate(['/'])
  }

  ngOnInit() {
    this.http.get("/member", {
      observe: "body",
      params: new HttpParams().append('token', localStorage.getItem('token'))
    }).subscribe((result:any)=>{
      if(result.status == "error"){
        this.router.navigate(['/'])
      }
    })

    this.http.post<any>("/listmember", {}).subscribe(result=>{
      this.list_member = result
    })
  }

}
