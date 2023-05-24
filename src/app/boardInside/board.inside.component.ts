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
  cycleGraphData: Array<any>;
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
    this.cycleGraphData = new Array<any>()
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
        this.changeMode(clicked)
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

  deleteTask(task: Task, taskList: TaskList, subtaskMode:boolean) {
    let dialogDeleteTask = this._dialog.open(DeleteElementDialogComponent, {
      data: {'title': task.title, 'type': 'task'}
    });
    dialogDeleteTask.afterClosed().subscribe(result => {
      if (result) {
          if (subtaskMode){
            this.taskService.deleteSubTask(task.id!!).subscribe(taskResponse => {
              if (taskResponse) {
                taskList = this.getTaskList(taskResponse)!!
                let taskF = taskList.tasks.filter(task=>task.id===taskResponse.id)
                let index = taskList.tasks.indexOf(taskF[0])
                if (index !== -1) {
                  taskList.tasks[index] = taskResponse
                  this.taskDeleted.emit()
                }
              }
            });
          }else {
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

  changeMode(mode:string) {
    if (mode == 'list') {
      localStorage.setItem('viewMode', 'list');
      this.mode = 'list'
    } else if (mode=='board') {
      localStorage.setItem('viewMode', 'board');
      this.mode = 'board'
    }
  }

  private getTaskList(task: Task) {
    return this.taskLists.find((taskList: TaskList) => {
      return taskList.tasks.some((t: Task) => t.id === task.id);
    });
  }
  private _calculateDaysBetweenDates(date1: Date, date2: Date): number {
    console.log(date1)
    console.log(date2)
    // Calculate the time difference in milliseconds
    const timeDifference = date2.getTime() - date1.getTime();

    // Convert milliseconds to days
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  }

  private openStats() {
    this.mode = 'stats'
    let taskDict: { [user: string]: { [state: string]: number } } = {};
    let noUser = "No asignado"
    const tasks:Task[] = new Array<Task>;
    for (let list of this.taskLists) {
      let title = list.title;
      for (let task of list.tasks) {
        tasks.push(task)
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

    this.cycleGraphData = tasks.map(task => {
        let dateStartCycle = task.date_start_cycle_time;
        const dateStartLead = new Date(task.date_start_lead_time!!);
        let dateEndCycle = task.date_end_cycle_time
        let dateEndLead = task.date_end_lead_time

        let nameCycle="Cycle time"
        if (!dateEndCycle){
          nameCycle+="* (En progreso)"
          dateEndCycle = new Date()
        }else{
          dateEndCycle = new Date(dateEndCycle!!);

        }
        let nameLead="Lead time"
        if (!dateEndLead){
          nameLead+="* (En progreso)"
          dateEndLead = new Date()
        }else{
          dateEndLead = new Date(dateEndLead!!);
        }
        let daysCycle=0
        if (dateStartCycle){
          dateStartCycle = new Date(dateStartCycle!!)
          daysCycle = this._calculateDaysBetweenDates(dateStartCycle!!,dateEndCycle!!)
        }else{
          nameCycle="Cycle time* (No iniciado)"
        }
        const daysLead = this._calculateDaysBetweenDates(dateStartLead!!,dateEndLead!!)

        return {
            name: task.title,
            series: [{name:nameCycle,
                      value:daysCycle,
                      extra: {start:task.date_start_cycle_time,
                              end:task.date_end_cycle_time}
                    },
                    {name:nameLead,
                      value:daysLead,
                      extra: {start:task.date_start_lead_time,
                              end:task.date_end_lead_time}
                    }]
          };
      });
  }

  openTask(task: Task, subTaskMode:boolean) {
    if (!this.taskCards.some(card=>card.matMenuTrigger.menuOpen)) {
      let dialogTaskDetails = this._dialog.open(TaskDetailsDialog, {
        width: '80%',
        data: {task:task,boardId:this.boardId, subTaskMode:subTaskMode},
        panelClass: 'my-dialog-container',
        autoFocus: false
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
        this.deleteTask(task, tasklist,subTaskMode)
        this.taskDeleted.subscribe(() => {
          dialogTaskDetails.close()
        });
      });
      dialogTaskDetails.componentInstance.openSubTaskClicked.subscribe((task: Task) => {
        this.openTask(task,true)
      });
    }
  }

}



