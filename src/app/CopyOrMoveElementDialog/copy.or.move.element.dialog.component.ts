import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {BoardService} from "../services/board.service";
import {Board} from "../board.model";

export interface CopyOrMoveElementDialogData {
  title: string;
  type: string;
  mode:string;
}

@Component({
  templateUrl: './copy.or.move.element.dialog.component.html',
  styleUrls: ['./copy.or.move.element.dialog.component.css']
})
export class CopyOrMoveElementDialogComponent {
  selectFormControl = new FormControl('', Validators.required);
  boards:Board[]=[];
  boardSelected: Board | undefined;
  constructor(
    public dialogRef: MatDialogRef<CopyOrMoveElementDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: CopyOrMoveElementDialogData,
    public boardService:BoardService
  ) {
    boardService.getBoards().subscribe(
      (boards: Board[]) => {
        this.boards = boards
      },error => console.log(error)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  select(b:Board){
    this.boardSelected=b
  }


}



