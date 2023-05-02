import {Component, EventEmitter, OnInit, ViewChildren} from '@angular/core';
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
import {SharedService} from "../shared.service";
import {Subscription, lastValueFrom} from "rxjs";
import {AppComponent} from "../app.component";
import {BoardService} from "../services/board.service";
import {TaskDetailsDialog} from "../TaskDetailsDIalog/task.details.dialog.component";
import {TaskCardComponent} from "../taskCard/taskCard.component";

@Component({
  templateUrl: './board.inside.component.html',
  styleUrls: ['./board.inside.component.css']
})
export class BoardInsideComponent implements OnInit {
  taskLists: TaskList[]

  boardId: string | null
  mode: string
  subscriptionOnChangeViewMode: Subscription | undefined
  subscriptionOnOpenStats: Subscription | undefined
  subscription: Subscription | undefined
  userData: Array<any>
  @ViewChildren(TaskCardComponent) taskCards!:TaskCardComponent[];
  taskDeleted = new EventEmitter<void>();

  constructor(
    public router: Router,
    public taskListService: TaskListService,
    private activateRoute: ActivatedRoute,
    public taskService: TaskService,
    private _dialog: MatDialog,
    private sharedService: SharedService,
    private appComponent: AppComponent,
    public boardService: BoardService,
  ) {
    this.taskLists = []
    this.boardId = ""
    this.mode = localStorage.getItem("viewMode") || "board"
    this.userData = new Array<any>()
  }


  ngOnInit(): void {
    this.subscription = this.activateRoute.params.subscribe(_ => {
      this.initialization()
    });
  }

  async initialization() {
    this.activateRoute.paramMap.subscribe((obs) => {
      if (obs.get('id') != null) {
        this.boardId = obs.get('id')
      }
    });
    try {
      this.taskLists = await lastValueFrom(this.taskListService.getTaskLists(this.boardId!!));
      if (this.taskLists.length > 0) {
        this.appComponent.board = this.taskLists[0].board
      }
    } catch (error) {
      console.log(error);
    }
    if (this.appComponent.boards === undefined) {
      try {
        this.appComponent.boards = await lastValueFrom(this.boardService.getBoards());
      } catch (error) {
        console.log(error);
      }
    }
    this.subscriptionOnChangeViewMode = this.sharedService.buttonClickChangeView$.subscribe((clicked) => {
      if (clicked) {
        this.changeMode()
      }
    });
    this.subscriptionOnOpenStats = this.sharedService.buttonClickStats$.subscribe((clicked) => {
      if (clicked) {
        this.openStats()
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionOnChangeViewMode?.unsubscribe()
    this.subscriptionOnOpenStats?.unsubscribe()
    this.subscription?.unsubscribe()
  }

  updatePositionTask(id: number, position: number, listId: number) {
    this.taskService.updatePosition(id, position, listId).subscribe(
      (_: Task) => {
      }, error => console.log(error)
    );
  }

  updatePositionTaskList(id: number, position: number) {
    this.taskListService.updatePosition(id, position).subscribe(
      (_: TaskList) => {

      }, error => console.log(error)
    );
  }

  getTaskListId(event: CdkDragDrop<any[]>) {
    return event.previousContainer === event.container ? event.container.data[event.previousIndex].id :
      event.previousContainer.data[event.previousIndex].id
  }

  drop(event: CdkDragDrop<any[]>, type: string, list?: TaskList) {
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
      data: {'title': '', 'description': '', 'type': 'task', 'editMode':false}
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
            if (!list.tasks) {
              list.tasks = []
            }
            list.tasks.push(task)
          });
      }

    })

  }

  addTaskList() {
    let dialogAddTaskList = this._dialog.open(AddElementDialogComponent, {
      data: {'title': '', 'type': 'list','editMode':false}
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

  copyList(list: TaskList) {
    let dialogCopyTaskList = this._dialog.open(CopyOrMoveElementDialogComponent, {
      data: {'title': list.title, 'type': 'list', 'mode': 'copy'}
    });
    dialogCopyTaskList.afterClosed().subscribe(boardSelected => {
      if (boardSelected) {
        this.taskListService.copy(list.id!!, boardSelected.board.id)
          .subscribe(listResponse => {
            if (list?.board?.id === listResponse?.board?.id) {
              this.taskLists.push(listResponse)
            }
          });
      }
    })
  }

  moveList(list: TaskList) {
    let dialogMoveTaskList = this._dialog.open(CopyOrMoveElementDialogComponent, {
      data: {'title': list.title, 'type': 'list', 'mode': 'move'}
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
                taskList.tasks.splice(index, 1);
                this.taskDeleted.emit()
              }
            }
          });
      }
    })

  }

  moveTask(task: Task, oldTaskList: TaskList) {
    let dialogMoveTask = this._dialog.open(CopyOrMoveElementDialogComponent, {
      data: {'title': task.title, 'type': 'task', 'mode': 'move'}
    });
    dialogMoveTask.afterClosed().subscribe(data => {
      if (data) {
        this.taskService.move(task.id!!, data.list.id)
          .subscribe(taskResponse => {
            let index = oldTaskList.tasks.indexOf(task)
            if (index !== -1) {
              oldTaskList.tasks.splice(index, 1);
            }
            if (taskResponse && Number(this.boardId) == taskResponse.taskList!!.board!!.id) {
              let newList: TaskList[] = this.taskLists.filter(list => list.id == data.list.id)
              if (newList) {
                newList[0].tasks.push(taskResponse);
              }
            }
          });
      }
    })

  }

  copyTask(task: Task) {
    let dialogCopyTask = this._dialog.open(CopyOrMoveElementDialogComponent, {
      data: {'title': task.title, 'type': 'task', 'mode': 'copy'}
    });
    dialogCopyTask.afterClosed().subscribe(data => {
      if (data) {
        this.taskService.copy(task.id!!, data.list.id)
          .subscribe(taskResponse => {
            console.log(taskResponse)
            if (taskResponse && Number(this.boardId) == taskResponse.taskList!!.board!!.id) {
              let newList: TaskList[] = this.taskLists.filter(list => list.id == data.list.id)
              if (newList) {
                newList[0].tasks.push(taskResponse);
              }
            }
          });
      }
    })
  }

  changeMode() {
    let mode = localStorage.getItem("viewMode") || "board"
    if (mode == 'board') {
      localStorage.setItem('viewMode', 'list');
      this.mode = 'list'
    } else {
      localStorage.setItem('viewMode', 'board');
      this.mode = 'board'
    }
  }

  private getTaskList(task: Task) {
    return this.taskLists.find((taskList: TaskList) => {
      return taskList.tasks.some((t: Task) => t.id === task.id);
    });
  }

  private openStats() {
    this.mode = 'stats'
    let taskDict: { [user: string]: { [state: string]: number } } = {};
    let noUser = "No asignado"
    for (let list of this.taskLists) {
      let title = list.title;
      for (let task of list.tasks) {
        let users = task.users ? task.users : [];
        if (users.length === 0) {
          taskDict[noUser] ??= {};
          taskDict[noUser][title] ??= 0;
          taskDict[noUser][title]++;
        }
        for (const user of users) {
          let name = user.name;
          taskDict[name] ??= {};
          taskDict[name][title] ??= 0;
          taskDict[name][title]++;
        }
      }
    }
    this.userData = [];
    for (let user in taskDict) {
      let userStatuses = [];
      let userTotal = 0;
      for (let state in taskDict[user]) {
        userStatuses.push({name: state, value: taskDict[user][state]});
        userTotal += taskDict[user][state];
      }
      this.userData.push({name: user, statuses: userStatuses, total: userTotal});
    }

  }

  openTask(task: Task) {
    if (!this.taskCards.some(card=>card.matMenuTrigger.menuOpen)) {
      let dialogTaskDetails = this._dialog.open(TaskDetailsDialog, {
        width: '70%',
        data: {task:task,boardId:this.boardId},
        panelClass: 'my-dialog-container'
      });
      dialogTaskDetails.afterClosed().subscribe(data => {

      })
      dialogTaskDetails.componentInstance.copyClicked.subscribe((task: Task) => {
        this.copyTask(task)
      });
      dialogTaskDetails.componentInstance.moveClicked.subscribe((task: Task) => {
        let tasklist = this.getTaskList(task)!!
        this.moveTask(task, tasklist)
      });
      dialogTaskDetails.componentInstance.deleteClicked.subscribe((task: Task) => {
        let tasklist = this.getTaskList(task)!!
        this.deleteTask(task, tasklist)
        this.taskDeleted.subscribe(() => {
          dialogTaskDetails.close()
        });
      });
    }
  }

}



