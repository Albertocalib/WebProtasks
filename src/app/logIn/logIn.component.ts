import { Component} from '@angular/core';
import {LoginService} from "../services/logIn.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  templateUrl: 'logIn.component.html',
  styleUrls: ['logIn.component.css']
})
export class LogInComponent{
  hide = true;
  title = "WebProtasks"
  username: string | undefined;
  password: string | undefined;

  constructor(
    public loginService: LoginService,
    public router: Router,
    public snackBar: MatSnackBar
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
        this.snackBar.open('Invalid user or password', 'Cerrar', {
          duration: 2000,
          verticalPosition:"top"
        });
      },
    );

  }

}



