import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {BoardService} from "../services/board.service";
import {Board} from "../board.model";
import {TaskList} from "../tasklist.model";

export interface CopyOrMoveElementDialogData {
  title: string;
  type: string;
  mode:string;
}

@Component({
  templateUrl: './copyOrMove.element.dialog.component.html',
  styleUrls: ['./copyOrMove.element.dialog.component.css']
})
export class CopyOrMoveElementDialogComponent {
  selectFormControl = new FormControl('', Validators.required);
  boards:Board[]=[];
  boardSelected: Board | undefined;
  listSelected: TaskList | undefined;
  lists:TaskList[]=[];

  constructor(
    public dialogRef: MatDialogRef<CopyOrMoveElementDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: CopyOrMoveElementDialogData,
    public boardService:BoardService
  ) {
    dialogRef.disableClose = true;
    boardService.getBoards().subscribe(
      (boards: Board[]) => {
        if (data.type=="task"){
          boards = boards.filter(element => element.taskLists && element.taskLists.length>0)
        }
        this.boards = boards
      },error => console.log(error)
    );
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  select(b:Board){
    this.boardSelected=b
    this.lists = b.taskLists!!
  }
  selectList(l:TaskList){
    this.listSelected=l
  }
  submit(){
    this.dialogRef.close({'board':this.boardSelected, 'list':this.listSelected})
  }


}



