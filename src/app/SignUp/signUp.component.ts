import { Component} from '@angular/core';
import {LoginService} from "../services/logIn.service";
import {Router} from "@angular/router";
import {User} from "../user.model";

@Component({
  selector: 'signUp-component',
  templateUrl: 'signUp.component.html',
  styleUrls: ['signUp.component.css']
})
export class signUpComponent {
  hide = true;
  title = "WebProtasks"
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  passEqualsElement: string | undefined;
  userRegister: User

  constructor(
    public loginService: LoginService,
    public router: Router
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
        alert('Invalid user or password');
      },
    );

  }
  signUp(){
    this.loginService.register(this.userRegister).subscribe(
      (u:User)=>{
        alert("Cuenta creada satisfactoriamente");
        this.router.navigate(['/logIn']);
      },error1 => console.log(error1)
    )
  }
}



