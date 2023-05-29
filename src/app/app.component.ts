import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "./services/logIn.service";
import {Board} from "./board.model";
import {SharedService} from "./shared.service";
import {MatSidenav} from "@angular/material/sidenav";
import {MatDialog} from "@angular/material/dialog";
import {ProfilePhotoDialogComponent} from "./ProfilePhotoDialog/profile.photo.dialog.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = "WebProtasks"
  boards: Board[] | undefined
  board: Board | undefined
  settingsOpened:boolean=false
  @ViewChild("sidenav") sidenav!:MatSidenav;

  constructor(
    public router: Router,
    public loginService: LoginService,
    private sharedService: SharedService,
    private dialog:MatDialog
  )
  {
  }

  logOut(){
    this.boards=undefined
    this.sidenav.close();
    this.loginService.logOut()
    this.router.navigate(["/logIn"])
  }
  openStats(){
    this.sharedService.notifyOpenStats(true)
  }
  changeVIewMode(mode:string){
    this.sharedService.notifyButtonClickChangeView(mode)
  }
  goToHome(){
    this.board=undefined
    this.router.navigate(["/"])
  }
  openBoard(board:Board){
    this.settingsOpened=false
    this.board=board
    this.sharedService.resetObservers()
    this.router.navigate(['/board/'+board.id]);
  }


  openSettings() {
    this.settingsOpened=true
    this.router.navigate([`/board/${this.board?.id}/settings`]);
  }

  openProfilePic() {
    const dialogRef = this.dialog.open(ProfilePhotoDialogComponent, { width: '80vw',
      height: '75vh',
    });
  }
}



