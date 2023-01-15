import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {logInComponent} from "./logIn/logIn.component";
import {signUpComponent} from "./SignUp/signUp.component";
import {AuthGuard} from "./AuthGuard";
import {MainBoardComponent} from "./main.board.component";

const routes: Routes = [{ path: 'logIn', component: logInComponent},

  { path: 'signUp', component: signUpComponent},

  { path:'', component: MainBoardComponent, canActivate: [AuthGuard]},

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
