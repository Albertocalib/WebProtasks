import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TaskService} from "../services/task.service";
import {Task} from "../task.model";
import {TaskList} from "../tasklist.model";
import {CopyOrMoveElementDialogComponent} from "../CopyOrMoveElementDialog/copyOrMove.element.dialog.component";
import {User} from "../user.model";
import {Tag} from "../tag.model";
import {TagService} from "../services/tag.service";

@Component({
  templateUrl: './task.details.dialog.component.html',
  styleUrls: ['./task.details.dialog.component.css']
})
export class TaskDetailsDialog {
  @Output() deleteClicked = new EventEmitter<Task>();
  @Output() copyClicked = new EventEmitter<Task>();
  @Output() moveClicked = new EventEmitter<Task>();
  removable:boolean;
  constructor(
    public dialogRef: MatDialogRef<TaskDetailsDialog>,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public task: Task,
    public taskService:TaskService,
    public tagService:TagService
  ) {
    dialogRef.disableClose = true;
    this.removable=true;
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


  removeUser(user:User) {
    this.taskService.removeAssigment(user.id!!, this.task?.id!!)
      .subscribe(response => {
          if (response) {
            let index = this.task.users?.indexOf(user)
            if (index!=null && index !== -1) {
              this.task.users?.splice(index!!, 1);
            }
          }
        }
      )
  }

  removeTag(t: Tag) {
    this.tagService.delete(t.id!!, this.task?.id!!)
      .subscribe(response => {
          if (response) {
            let index = this.task.tag_ids?.indexOf(t)
            if (index!=null && index !== -1) {
              this.task.tag_ids?.splice(index, 1);
            }
          }
        }
      )
  }
}



