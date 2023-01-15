import { Component} from '@angular/core';
import {LoginService} from "../services/logIn.service";
import {Router} from "@angular/router";


@Component({
  templateUrl: 'logIn.component.html',
  styleUrls: ['logIn.component.css']
})
export class logInComponent{
  hide = true;
  title = "WebProtasks"
  username: string | undefined;
  password: string | undefined;

  constructor(
    public loginService: LoginService,
    public router: Router
  )
  {

  }

  logIn($event: any, email:string, password:string) {
    this.loginService.logIn(email, password).subscribe(
      (u) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        alert('Invalid user or password');
      },
    );

  }

}



