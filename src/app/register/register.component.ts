import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  reactcha:String = ""
  username
  password
  email

  resolved(captchaResponse: string) {
    this.reactcha = captchaResponse
  }

  constructor(private http: HttpClient, private router: Router) { } 

  onRegister(data: NgForm){
    let dataRegister = {
      username: data.value.username,
      password: data.value.password,
      email: data.value.email,
      recaptcha: this.reactcha
    }

    this.http.post<any>('/register', dataRegister).subscribe(result=>{
      //result = JSON.stringify(result)

      if(result.status == "error"){
        Swal.fire({
          type: 'error',
          title: result.title,
          text: result.msg,
        })
      } else if(result.status == "success"){
        this.router.navigate(['/member'])
      }
    })
  }

  ngOnInit() {
    this.http.get("/member", {
      observe: "body",
      params: new HttpParams().append('token', localStorage.getItem('token'))
    }).subscribe((result:any)=>{
      if(result.username){
        this.router.navigate(['/'])
      }
    })
  }

}
