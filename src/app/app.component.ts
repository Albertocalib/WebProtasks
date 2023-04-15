import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "./services/logIn.service";
import {Board} from "./board.model";
import {SharedService} from "./shared.service";
import {MatSidenav} from "@angular/material/sidenav";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = "WebProtasks"
  boards: Board[] | undefined
  board: Board | undefined
  @ViewChild("sidenav") sidenav!:MatSidenav;

  constructor(
    public router: Router,
    public loginService: LoginService,
    private sharedService: SharedService,
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

  async downloadPhoto() {
    const link = document.createElement('a');
    const photo = this.loginService.user?.photo
    if (photo != null) {
      link.href = `data:image/png;base64,${photo?.substring(1, photo.length - 1)}`;
    } else {
      link.href = await this.fileToBase64('../assets/user-default.png');
    }
    const currentTimeMillis = new Date().getTime();
    link.download = `${this.loginService.user?.username}-${currentTimeMillis}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  editPhoto(l: FileList | null): void  {
    if (l != null && l.length) {
      const f = l[0];
      const imageType = /^image\//;

      if (!imageType.test(f.type)) {
        alert('Por favor seleccione solo archivos de imagen');
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        let photo = (reader.result as string).split(',')[1];
        this.loginService.updatePhoto(photo).subscribe(updatedUser => {
          if (updatedUser) {
            this.loginService.setCurrentUser(updatedUser);
          }
        });
      };
    }
  }

  async fileToBase64(route: string): Promise<string> {
    const response = await fetch(route);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}



