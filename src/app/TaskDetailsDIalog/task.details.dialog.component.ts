import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TaskService} from "../services/task.service";
import {Task} from "../task.model";
import {TaskList} from "../tasklist.model";
import {CopyOrMoveElementDialogComponent} from "../CopyOrMoveElementDialog/copyOrMove.element.dialog.component";

@Component({
  templateUrl: './task.details.dialog.component.html',
  styleUrls: ['./task.details.dialog.component.css']
})
export class TaskDetailsDialog {
  @Output() deleteClicked = new EventEmitter<Task>();
  @Output() copyClicked = new EventEmitter<Task>();
  @Output() moveClicked = new EventEmitter<Task>();

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsDialog>,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public task: Task,
    public taskService:TaskService
  ) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  submit(){
    this.dialogRef.close({})
  }
  move() {
    this.moveClicked.emit(this.task)
  }

  copy() {
    this.copyClicked.emit(this.task)
  }

  delete() {
    this.deleteClicked.emit(this.task)
  }


}



