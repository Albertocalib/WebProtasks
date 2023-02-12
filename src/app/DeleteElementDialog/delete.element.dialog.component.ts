import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

export interface DeleteElementDialogData {
  title: string;
  type: string;
}

@Component({
  templateUrl: './delete.element.dialog.component.html',
  styleUrls: ['./delete.element.dialog.component.css']
})
export class DeleteElementDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteElementDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteElementDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


}



