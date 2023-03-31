import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "./services/logIn.service";
import {Board} from "./board.model";
import {SharedService} from "./shared.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = "WebProtasks"
  boards: Board[] | undefined
  board: Board | undefined
  constructor(
    public router: Router,
    public loginService: LoginService,
    private sharedService: SharedService,
  )
  {
  }

  logOut(){
    this.boards=undefined
    this.loginService.logOut()
    this.router.navigate(["/logIn"])
  }
  openStats(){
    this.sharedService.notifyOpenStats(true)
  }
  changeVIewMode(){
    this.sharedService.notifyButtonClickChangeView(true)
  }
  goToHome(){
    this.board=undefined
    this.router.navigate(["/"])
  }
  openBoard(board:Board){
    this.board=board
    this.sharedService.resetObservers()
    this.router.navigate(['/board/'+board.id]);
  }
}



