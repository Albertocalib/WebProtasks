import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";

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

  onColorChange($event: any) {
    
  }
}



