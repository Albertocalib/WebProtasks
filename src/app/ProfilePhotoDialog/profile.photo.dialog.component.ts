import {Component} from '@angular/core';
import {LoginService} from "../services/logIn.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  templateUrl: './profile.photo.dialog.component.html',
  styleUrls: ['./profile.photo.dialog.component.css']
})
export class ProfilePhotoDialogComponent {
  constructor(
    public loginService:LoginService,
    public snackBar: MatSnackBar


) {}

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
    if (l?.length) {
      const f = l[0];

      if (!f.type.startsWith('image')) {
        this.snackBar.open('Por favor seleccione solo archivos de imagen', 'Cerrar', {
          duration: 2000,
          verticalPosition:"top"
        });
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



