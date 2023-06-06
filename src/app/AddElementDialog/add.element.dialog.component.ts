import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import { createCanvas } from 'canvas';
import {MatSelect} from "@angular/material/select";

export interface AddElementDialogData {
  title: string;
  description: string;
  type:string;
  photo?:string;
  color?:string;
  photo_name?:string;
  editMode:boolean;
}

@Component({
  templateUrl: './add.element.dialog.component.html',
  styleUrls: ['./add.element.dialog.component.css']
})
export class AddElementDialogComponent{

  display: FormControl = new FormControl("", Validators.required);
  selectedColor = ''
  mode = ''
  areRequiredFieldsFilled:boolean = false;
  @ViewChild("selector")
  selectElement!: MatSelect;
  constructor(
    public dialogRef: MatDialogRef<AddElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddElementDialogData,
  ) {
    this.display.disable();
  }
  ngAfterViewInit() {
    if (this.data.color!=null){
      this.selectedColor=this.data.color
      this.mode = 'color'
      this.selectElement.value = 'color';
    }else if(this.data.photo_name!=null){
      this.display.patchValue(`${this.data.photo_name}`);
      this.mode = 'image';
      this.selectElement.value = 'image';
    }
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onImgSelected(l: FileList|null): void {
    if (l?.length) {
      const f = l[0];

      if (!f.type.startsWith('image')){
        alert('Por favor seleccione solo archivos de imagen');
        return;
      }
      this.display.patchValue(`${f.name}`);
      this.data.photo_name = f.name
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        this.data.photo = (reader.result as string).split(',')[1];
      };
    } else {
      this.display.patchValue("");
    }
  }

  onColorChange(color: string) {
    this.selectedColor = color;
    this.data.color = color
    if (this.data.type!='tag'){
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
      title.forEach(word => {
        initials += word.charAt(0).toUpperCase();
      });
      ctx.fillText(initials, x, y);

      // Convert the canvas to a base64-encoded PNG image
      const dataUrl = canvas.toDataURL('image/png');
      this.data.photo = dataUrl.split(',')[1];
    }

  }

  selectMode(value:string) {
    this.mode=value
  }
}



