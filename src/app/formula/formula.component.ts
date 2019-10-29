import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {

  welcome:string = ""
  username:string = ""
  credit:any = ""
  credit_title:string = ""

  account = 0

  // ship images path
  red_chip = "../../assets/images/red.PNG"
  blue_chip = "../../assets/images/blue.PNG"
  green_chip = "../../assets/images/green.PNG"

  chip_img:string = ""
  id:any = 10
  id_history:any = 100

  arr_chip = []

  formula_chip:string = ""
  arr_history = []

  constructor(private http: HttpClient) { }

  clear_chip(){
    var clear_id = 10
    for(let i=0;i<10;i++){
      for(let j=0;j<60;j+=10){
        document.getElementById((clear_id+j+i).toString()).className = "sqr"
      }
    }

    this.id = 10
    this.arr_chip = []
  }

  clear_history(){
    var clear_id = 100
    for(let i=0;i<10;i++){
      for(let j=0;j<600;j+=100){
        document.getElementById((clear_id+j+i).toString()).className = "sqr"
      }
    }

    this.id = 100
  }

  chip(result){

    if(result == "red" || result == "blue") this.arr_chip.push(result)

    this.formula_chip = ""

    if(result == "red") document.getElementById(this.id.toString()).className = "change_red"
    else if(result == "blue") document.getElementById(this.id.toString()).className = "change_blue"
    else if(result == "green") document.getElementById(this.id.toString()).className = "change_green"

    this.id += 10

    switch (this.id){
      case 70: 
        this.id = 10
        this.id+=1
        break
      case 71:
        this.id = 10
        this.id+=2
        break
      case 72:
          this.id = 10
          this.id+=3
          break
      case 73:
          this.id = 10
          this.id+=4
          break
      case 74:
          this.id = 10
          this.id+=5
          break
      case 75:
          this.id = 10
          this.id+=6
          break
      case 76:
          this.id = 10
          this.id+=7
          break
      case 77:
          this.id = 10
          this.id+=8
          break
      case 78:
          this.id = 10
          this.id+=9
          break
    }
  }

  formula(){
    if(this.credit > 5){
      let query_formula = {
        username: this.username,
        credit: this.credit
      }
      this.http.post<any>("/formula", query_formula).subscribe(call=>{
        this.credit -= 5

        let random_chip = this.arr_chip[Math.floor(Math.random()*this.arr_chip.length)]
        this.formula_chip = "../../assets/images/"+random_chip+".PNG"
        this.history(random_chip)
      })
    } else{
      Swal.fire({
        type: "warning",
        title: "เครดิตของท่านไม่พอ",
        text: "กรุณาเติมเครดิตเพื่อทำรายการ"
      })
    }
  }

  history(chip){

    if(chip == "red") document.getElementById(this.id_history.toString()).className = "change_red"
    else if(chip == "blue") document.getElementById(this.id_history.toString()).className = "change_blue"
    else if(chip == "green") document.getElementById(this.id_history.toString()).className = "change_green"

    this.id_history += 100

    switch (this.id_history){
      case 70: 
        this.id = 100
        this.id+=1
        break
      case 71:
        this.id = 100
        this.id+=2
        break
      case 72:
          this.id = 100
          this.id+=3
          break
      case 73:
          this.id = 100
          this.id+=4
          break
      case 74:
          this.id = 100
          this.id+=5
          break
      case 75:
          this.id = 100
          this.id+=6
          break
      case 76:
          this.id = 100
          this.id+=7
          break
      case 77:
          this.id = 100
          this.id+=8
          break
      case 78:
          this.id = 100
          this.id+=9
          break
    }
  }

  ngOnInit() {
    this.account = 0
    this.http.get("/member", {
      observe: "body",
      params: new HttpParams().append('token', localStorage.getItem('token'))
    }).subscribe((result:any)=>{
      if(result.username && result.credit){
        this.welcome = "สวัสดีคุณ "
        this.username = result.username
        this.credit = result.credit
        this.credit_title = "เครดิตคงเหลือ "
        this.account = 1
      }
      else this.account = 0
    })
  }

}
