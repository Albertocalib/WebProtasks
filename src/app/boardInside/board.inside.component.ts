import {Component, EventEmitter, OnInit, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaskList} from "../tasklist.model";
import {Task} from "../task.model";
import {TaskListService} from "../services/tasklist.service";
import {TaskService} from "../services/task.service";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
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
import {DatePipe} from "@angular/common";
import {Board} from "../board.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  templateUrl: './board.inside.component.html',
  styleUrls: ['./board.inside.component.css']
})
export class BoardInsideComponent implements OnInit {
  taskLists: TaskList[]

  boardId: string | null
  board?:Board
  mode: string
  subscriptionOnChangeViewMode: Subscription | undefined
  subscriptionOnOpenStats: Subscription | undefined
  subscription: Subscription | undefined
  userData: Array<any>
  cycleGraphData: Array<any>;
  colorSchema: Array<any>;
  colorSchemaPie: Array<any>;
  @ViewChildren(TaskCardComponent) taskCards!:TaskCardComponent[];
  taskDeleted = new EventEmitter<void>();
  wipLimit?:number
  backgroundColor="#00000007"
  colors = {
      cycle: '#7f2a91',
      lead: '#07a5fa', // Colores personalizados
    };

  constructor(
    public router: Router,
    public taskListService: TaskListService,
    private activateRoute: ActivatedRoute,
    public taskService: TaskService,
    public _dialog: MatDialog,
    private sharedService: SharedService,
    private appComponent: AppComponent,
    public boardService: BoardService,
    public datepipe: DatePipe,
    private _snackBar: MatSnackBar
  ) {
    this.taskLists = []
    this.boardId = ""
    this.mode = localStorage.getItem("viewMode") ?? "board"
    this.userData = new Array<any>()
    this.cycleGraphData = new Array<any>()
    this.colorSchema = new Array<any>()
    this.colorSchemaPie = new Array<any>()
  }


  ngOnInit(): void {
    this.subscription = this.activateRoute.params.subscribe(async _ => {
      await this.initialization()
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
        this.board=this.taskLists[0].board
        this.wipLimit=this.board?.wipLimit
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
    // Calculate the time difference in milliseconds
    const timeDifference = date2.getTime() - date1.getTime();

    // Convert milliseconds to days
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0;

  }

  private openStats() {
    this.mode = 'stats'
    let taskDict: { [user: string]: { [state: string]: number } } = {};
    let noUser = "No asignado"
    const tasks:Task[] = new Array<Task>;
    const colors = this._getListColors()
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
          let name = user.username!!;
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
        this.colorSchemaPie.push(({name:state,value:colors[state]}))
        userTotal += taskDict[user][state];
      }
      this.userData.push({name: user, statuses: userStatuses, total: userTotal});
    }
    if (this.board?.timeActivated) {
      this.cycleGraphData = tasks.map(task => {
        let dateStartCycle = task.date_start_cycle_time;
        const dateStartLead = new Date(task.date_start_lead_time!!);
        let dateEndCycle = task.date_end_cycle_time
        let dateEndLead = task.date_end_lead_time

        let nameCycle = "Cycle time"
        let dateStartCycleString = "Sin empezar"
        let dateEndCycleString = "In Progress"
        let dateStartLeadString = this.datepipe.transform(dateStartLead, 'dd-MM-yyyy')!!
        let dateEndLeadString = "In Progress"

        if (!dateEndCycle) {
          dateEndCycle = new Date()
        } else {
          dateEndCycle = new Date(dateEndCycle);
          dateEndCycleString = this.datepipe.transform(dateEndCycle, 'dd-MM-yyyy')!!

        }
        let nameLead = "Lead time"
        if (!dateEndLead) {
          dateEndLead = new Date()
        } else {
          dateEndLead = new Date(dateEndLead);
          dateEndLeadString = this.datepipe.transform(dateEndLead, 'dd-MM-yyyy')!!
        }
        let daysCycle = 0
        if (dateStartCycle) {
          dateStartCycle = new Date(dateStartCycle)
          dateStartCycleString = this.datepipe.transform(dateStartCycle, 'dd-MM-yyyy')!!
          daysCycle = this._calculateDaysBetweenDates(dateStartCycle, dateEndCycle)
        }
        const daysLead = this._calculateDaysBetweenDates(dateStartLead, dateEndLead)
        this.colorSchema.push({name: nameCycle, value: this.colors.cycle})
        this.colorSchema.push({name: nameLead, value: this.colors.lead})
        return {
          name: task.title,
          series: [{
            name: nameCycle,
            value: daysCycle,
            extra: {
              start: dateStartCycleString,
              end: dateEndCycleString,
              nameTooltip: `${nameCycle} · ${task.title}`
            }
          },
            {
              name: nameLead,
              value: daysLead,
              extra: {
                start: dateStartLeadString,
                end: dateEndLeadString,
                nameTooltip: `${nameLead} · ${task.title}`
              }
            }]
        };
      });
    }
  }

  openTask(task: Task, subTaskMode:boolean) {
    if (!this.taskCards.some(card=>card.matMenuTrigger.menuOpen)) {
      let dialogTaskDetails = this._dialog.open(TaskDetailsDialog, {
        width: '80%',
        height: '85%',
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

  private static _generateRandomColor() {
    // Generar un número hexadecimal aleatorio entre 0 y 16777215
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomNumber = array[0] % 16777216;
    // Convertir el número a una cadena hexadecimal de 6 dígitos
    let cadena = randomNumber.toString(16).padStart(6, "0");
    return "#" + cadena;
  }
  private _getListColors() {
    let colors: { [list: string]: string } = {};

    let colorUsed = new Set()
    for (const list of this.taskLists) {
      let newColor = BoardInsideComponent._generateRandomColor()
      let hasColor= colorUsed.has(newColor)
      while (hasColor){
        newColor = BoardInsideComponent._generateRandomColor()
      }
      colorUsed.add(newColor)
      colors[list.title]=newColor
    }
    return colors
  }

  canDrop = (drag: CdkDrag, drop: CdkDropList) => {
    // Return true if the list has less than wipLimit items or false otherwise
    const canDrop = drop.data.length < this.wipLimit!!;
    if (!canDrop){
      this._snackBar.open('Se supera el límite máximo de WIP', 'Cerrar', {
        duration: 2000,
        verticalPosition:"top"
      });
      let previousColor = this.backgroundColor;
      // Cambiar el color actual al nuevo color
      this.backgroundColor = "red";
      // Después de 5 segundos, restaurar el color anterior
      setTimeout(() => {
        this.backgroundColor = previousColor;
      }, 2000);
    }
    return canDrop
  }
}



