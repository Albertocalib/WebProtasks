import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

export interface AddElementDialogData {
  title: string;
  description: string;
  type:string;
}

@Component({
  templateUrl: './add.element.dialog.component.html',
  styleUrls: ['./add.element.dialog.component.css']
})
export class AddElementDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddElementDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }


}



