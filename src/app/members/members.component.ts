import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  username
  password

  constructor(private http: HttpClient, private router: Router) { }

  onLogin(data){

    let data_login = {
      username: data.value.username,
      password: data.value.password
    }

    this.http.post<any>('/login', data_login).subscribe(callback=>{
      if(callback.status == "fail"){
        Swal.fire({
          type: "error",
          title: callback.msg
        })
      } else if(callback.status == "success"){
        localStorage.setItem("token", callback.token)

        if(callback.admin) this.router.navigate(['/admin'])
        else this.router.navigate(['/'])
      }
    })
  }

  ngOnInit() {
    this.http.get("/member", {
      observe: "body",
      params: new HttpParams().append('token', localStorage.getItem('token'))
    }).subscribe((result:any)=>{
      if(result.username == "wrong"){
        this.router.navigate(['/admin'])
      } else if(result.username){
        this.router.navigate(['/dashboard'])
      }
    })
  }

}
