import { Component} from '@angular/core';
import {LoginService} from "./logIn.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
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
    console.log(email);
    console.log(password);
    this.loginService.logIn(email, password).subscribe(
      (u) => {
        this.router.navigate(['/']);
        console.log(u);
      },
      (error) => {
        console.log(error);
        alert('Invalid user or password');
      },
    );

  }

}



