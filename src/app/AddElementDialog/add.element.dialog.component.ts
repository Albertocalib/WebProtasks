import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import { createCanvas } from 'canvas';

export interface AddElementDialogData {
  title: string;
  description: string;
  type:string;
  photo?:string;
}

@Component({
  templateUrl: './add.element.dialog.component.html',
  styleUrls: ['./add.element.dialog.component.css']
})
export class AddElementDialogComponent{
  constructor(
    public dialogRef: MatDialogRef<AddElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddElementDialogData,
  ) {
    this.display.disable();
  }
  display: FormControl = new FormControl("", Validators.required);
  selectedColor = ''
  mode = ''
  areRequiredFieldsFilled:boolean = false;
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onImgSelected(l: FileList|null): void {
    if (l != null && l.length) {
      const f = l[0];
      const imageType = /^image\//;

      if (!imageType.test(f.type)) {
        alert('Por favor seleccione solo archivos de imagen');
        return;
      }
      this.display.patchValue(`${f.name}`);
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        this.data.photo = reader.result as string;
      };
    } else {
      this.display.patchValue("");
    }
  }

  onColorChange(color: string) {
    this.selectedColor = color;
    const width = 400;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill the canvas with the background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Set the text style for the name
    const fontSize = 48;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';

    // Draw the name in the center of the canvas
    const x = width / 2;
    const y = height / 2 + fontSize / 2;
    let title = this.data.title.split(" ")
    let initials = ""
    title.map(word => {
      initials += word.charAt(0).toUpperCase();
    });
    ctx.fillText(initials, x, y);

    // Convert the canvas to a base64-encoded PNG image
    const dataUrl = canvas.toDataURL('image/png');
    this.data.photo = dataUrl.split(',')[1];

  }

  selectMode(value:string) {
    this.mode=value


  }
}



