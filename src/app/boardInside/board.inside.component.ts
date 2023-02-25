import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaskList} from "../tasklist.model";
import {Task} from "../task.model";
import {TaskListService} from "../services/tasklist.service";
import {TaskService} from "../services/task.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatDialog} from "@angular/material/dialog";
import {AddElementDialogComponent} from "../AddElementDialog/add.element.dialog.component";
import {DeleteElementDialogComponent} from "../DeleteElementDialog/delete.element.dialog.component";
import {CopyOrMoveElementDialogComponent} from "../CopyOrMoveElementDialog/copyOrMove.element.dialog.component";

@Component({
  templateUrl: './board.inside.component.html',
  styleUrls: ['./board.inside.component.css']
})
export class BoardInsideComponent implements OnInit {
  taskLists: TaskList[]

  boardId: string | null

  constructor(
    public router: Router,
    public taskListService: TaskListService,
    private activateRoute: ActivatedRoute,
    public taskService: TaskService,
    private _dialog: MatDialog
  ) {
    this.taskLists = []
    this.boardId = ""
  }


  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((obs) => {
      if (obs.get('id') != null) {
        this.boardId = obs.get('id')
      }
    });
    this.taskListService.getTaskLists(this.boardId!!).subscribe(
      (lists: TaskList[]) => {
        this.taskLists = lists
      }, error => console.log(error)
    );
  }

  updatePositionTask(id: Number, position: Number, listId: Number) {
    this.taskService.updatePosition(id, position, listId).subscribe(
      (_: Task) => {
      }, error => console.log(error)
    );
  }

  updatePositionTaskList(id: Number, position: Number) {
    this.taskListService.updatePosition(id, position).subscribe(
      (_: TaskList) => {

      }, error => console.log(error)
    );
  }

  getTaskListId(event: CdkDragDrop<any[]>) {
    return event.previousContainer === event.container ? event.container.data[event.previousIndex].id :
      event.previousContainer.data[event.previousIndex].id
  }

  drop(event: CdkDragDrop<any[]>, type: String, list?: TaskList) {
    if (type === "task") {
      let taskId = event.previousContainer.data[event.previousIndex].id;
      this.updatePositionTask(taskId, event.currentIndex + 1, list!!.id!!);
    } else {
      let taskListId = this.getTaskListId(event)
      this.updatePositionTaskList(taskListId, event.currentIndex + 1);
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  addTask(list: TaskList) {
    let dialogAddTask = this._dialog.open(AddElementDialogComponent, {
      data: {'title': '', 'description': '', 'type': 'task'}
    });
    dialogAddTask.afterClosed().subscribe(result => {
      if (result) {
        let position = 1
        if (list.tasks) {
          position = list.tasks.length + 1
        }
        let t: Task = {
          title: result.title,
          description: result.description,
          position: position
        }
        this.taskService.createTask(t, list.id!!)
          .subscribe(task => {
            list.tasks.push(task)
          });
      }

    })

  }
  addTaskList(){
    let dialogAddTaskList = this._dialog.open(AddElementDialogComponent, {
      data:{'title':'','type':'list'}
    });
    dialogAddTaskList.afterClosed().subscribe(result => {
      if (result) {
        let position = 1
        if (this.taskLists) {
          position = this.taskLists.length + 1
        }
        let list: TaskList = {
          title: result.title,
          position: position,
          tasks: Array<Task>()
        }
        this.taskListService.createList(list, +this.boardId!!)
          .subscribe(list => {
            this.taskLists.push(list)
          });
      }
    })
  }

  deleteList(list: TaskList) {
    let dialogDeleteTaskList = this._dialog.open(DeleteElementDialogComponent, {
      data: {'title': list.title, 'type': 'list'}
    });
    dialogDeleteTaskList.afterClosed().subscribe(result => {
      if (result) {
        this.taskListService.delete(list.id!!)
          .subscribe(listResponse => {
            if (listResponse) {
              let index = this.taskLists.indexOf(list)
              if (index !== -1) {
                this.taskLists.splice(index, 1);
              }
            }
          });
      }
    })
  }
  copyList(list:TaskList){
    let dialogCopyTaskList = this._dialog.open(CopyOrMoveElementDialogComponent, {
      data: {'title': list.title, 'type': 'list', 'mode': 'copy'}
    });
    dialogCopyTaskList.afterClosed().subscribe(boardSelected => {
      if (boardSelected) {
        this.taskListService.copy(list.id!!, boardSelected.board.id)
          .subscribe(listResponse => {
            if (listResponse && list.board!!.id == listResponse.board!!.id) {
              this.taskLists.push(listResponse)
            }
          });
      }
    })
  }
  moveList(list:TaskList){
    let dialogMoveTaskList = this._dialog.open(CopyOrMoveElementDialogComponent, {
      data: {'title': list.title, 'type': 'list','mode': 'move'}
    });
    dialogMoveTaskList.afterClosed().subscribe(boardSelected => {
      if (boardSelected) {
        this.taskListService.move(list.id!!, boardSelected.board.id)
          .subscribe(listResponse => {
            if (listResponse && list.board!!.id != listResponse.board!!.id) {
              let index = this.taskLists.indexOf(list)
              if (index !== -1) {
                this.taskLists.splice(index, 1);
              }
            }
          });
      }
    })
  }

  deleteTask(task: Task, taskList: TaskList) {
    let dialogDeleteTask = this._dialog.open(DeleteElementDialogComponent, {
      data: {'title': task.title, 'type': 'task'}
    });
    dialogDeleteTask.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.delete(task.id!!)
          .subscribe(taskResponse => {
            if (taskResponse) {
              let index = taskList.tasks.indexOf(task)
              if (index !== -1) {
                taskList.tasks.splice(index!!, 1);
              }
            }
          });
      }
    })

  }
  moveTask(task: Task, oldTaskList: TaskList){
    let dialogMoveTask = this._dialog.open(CopyOrMoveElementDialogComponent, {
      data: {'title': task.title, 'type': 'task', 'mode': 'move'}
    });
    dialogMoveTask.afterClosed().subscribe(data => {
      if (data) {
        this.taskService.move(task.id!!, data.list.id)
          .subscribe(taskResponse => {
            let index = oldTaskList.tasks.indexOf(task)
            if (index !== -1) {
              oldTaskList.tasks.splice(index!!, 1);
            }
            if (taskResponse && Number(this.boardId) == taskResponse.taskList!!.board!!.id) {
              let newList: TaskList[] = this.taskLists.filter(list => list.id == data.list.id)
              if (newList) {
                newList[0].tasks.push(task);
              }
            }
          });
      }
    })

  }
  copyTask(task:Task){
    let dialogCopyTask = this._dialog.open(CopyOrMoveElementDialogComponent, {
      data: {'title': task.title, 'type': 'task', 'mode': 'copy'}
    });
    dialogCopyTask.afterClosed().subscribe(data => {
      if (data) {
        this.taskService.copy(task.id!!,data.list.id)
          .subscribe(taskResponse => {
            if (taskResponse && Number(this.boardId) == taskResponse.taskList!!.board!!.id) {
              let newList: TaskList[] = this.taskLists.filter(list => list.id == data.list.id)
              if (newList) {
                newList[0].tasks.push(task);
              }
            }
          });
      }
    })
  }

}



