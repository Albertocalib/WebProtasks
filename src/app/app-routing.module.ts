import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LogInComponent} from "./logIn/logIn.component";
import {SignUpComponent} from "./SignUp/signUp.component";
import {AuthGuard} from "./AuthGuard";
import {MainBoardComponent} from "./mainBoard/main.board.component";
import {BoardInsideComponent} from "./boardInside/board.inside.component";

const routes: Routes = [{ path: 'logIn', component: LogInComponent},

  { path: 'signUp', component: SignUpComponent},

  { path: 'board/:id', component: BoardInsideComponent},

  { path:'', component: MainBoardComponent, canActivate: [AuthGuard]},

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
