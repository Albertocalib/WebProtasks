import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "./services/logIn.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = "WebProtasks"
  constructor(
    public router: Router,
    public loginService: LoginService,
  )
  {
  }

  logOut(){
    this.loginService.logOut()
    this.router.navigate(["/logIn"])
  }
}



