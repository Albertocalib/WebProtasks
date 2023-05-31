import { Component} from '@angular/core';
import {LoginService} from "../services/logIn.service";
import {Router} from "@angular/router";
import {User} from "../user.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'signUp-component',
  templateUrl: 'signUp.component.html',
  styleUrls: ['signUp.component.css']
})
export class SignUpComponent {
  hide = true;
  title = "WebProtasks"
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  passEqualsElement: string | undefined;
  userRegister: User

  constructor(
    public loginService: LoginService,
    public router: Router,
    public snackBar: MatSnackBar
  )
  {
    this.userRegister={name:"",surname:"",password:"",username:"",email:""}
  }

  logIn($event: any, email:string, password:string) {
    this.loginService.logIn(email, password).subscribe(
      (u) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Usuario o Contraseña Incorrecto', 'Cerrar', {
          duration: 2000,
          verticalPosition:"top"
        });
      },
    );

  }
  signUp(){
    this.loginService.register(this.userRegister).subscribe(
      (u:User)=>{
        this.snackBar.open('Cuenta creada satisfactoriamente', 'Cerrar', {
          duration: 2000,
          verticalPosition:"top"
        });
        this.router.navigate(['/logIn']);
      },error1 => console.log(error1)
    )
  }
}



