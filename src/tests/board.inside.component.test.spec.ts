import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app/app.component';
import { AddElementDialogComponent } from '../app/AddElementDialog/add.element.dialog.component';
import { BoardService } from '../app/services/board.service';
import { CopyOrMoveElementDialogComponent } from '../app/CopyOrMoveElementDialog/copyOrMove.element.dialog.component';
import { DeleteElementDialogComponent } from '../app/DeleteElementDialog/delete.element.dialog.component';
import { SharedService } from '../app/shared.service';
import { Task } from '../app/task.model';
import { TaskList } from '../app/tasklist.model';
import { TaskCardComponent } from '../app/taskCard/taskCard.component';
import { TaskListService } from '../app/services/tasklist.service';
import { TaskService } from '../app/services/task.service';
import { DatePipe } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { BoardInsideComponent } from '../app/boardInside/board.inside.component';
import {from, lastValueFrom, of} from "rxjs";
import SpyObj = jasmine.SpyObj;

describe('BoardInsideComponent', () => {
  let component: BoardInsideComponent;
  let router: Router;
  let taskListService: TaskListService;
  let taskService: TaskService;
  let dialog: MatDialog;
  let sharedService: SharedService;
  let appComponent: AppComponent;
  let datePipe: DatePipe;
  let snackBar: MatSnackBar;
  let tasklistServiceMock: SpyObj<TaskListService>
  let boardServiceMock: SpyObj<BoardService>
  let dialogMock: SpyObj<MatDialog>


  beforeEach(() => {
    tasklistServiceMock = jasmine.createSpyObj('TaskListService',
      {
        getTaskLists: {
          function() {}
        },
        createList: {
          subscribe: function (callback: ReturnType<any>) {
            callback({id: 2, title: 'Task List 2', tasks: []})
          }
        }
      });
    boardServiceMock = jasmine.createSpyObj('BoardService', ['getBoards']);
    dialogMock = jasmine.createSpyObj('MatDialog', {
      open: {
        afterClosed: function () {
          return {
            subscribe: function (callback: ReturnType<any>) {
              callback({title: 'New List'})
            }
          }
        }
      }
    });
    TestBed.configureTestingModule({
      declarations: [BoardInsideComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        },
        {
          provide: TaskListService,
          useValue: tasklistServiceMock
        },
        {
          provide: TaskService,
          useValue: { updatePosition: jasmine.createSpy('updatePosition').and.returnValue({}) }
        },
        {
          provide: MatDialog,
          useValue: dialogMock
        },
        {
          provide: SharedService,
          useValue: { buttonClickChangeView$: { subscribe: jasmine.createSpy('subscribe') }, buttonClickStats$: { subscribe: jasmine.createSpy('subscribe') } }
        },
        {
          provide: AppComponent,
          useValue: {}
        },
        {
          provide: BoardService,
          useValue: boardServiceMock
        },
        {
          provide: DatePipe,
          useValue: { transform: jasmine.createSpy('transform').and.returnValue('') }
        },
        {
          provide: MatSnackBar,
          useValue: {}
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: { subscribe: jasmine.createSpy('subscribe') },
            params: { subscribe: jasmine.createSpy('subscribe') }
          }
        }
      ]
    });

    component = TestBed.createComponent(BoardInsideComponent).componentInstance;
    router = TestBed.inject(Router);
    taskListService = TestBed.inject(TaskListService);
    taskService = TestBed.inject(TaskService);
    dialog = TestBed.inject(MatDialog);
    sharedService = TestBed.inject(SharedService);
    appComponent = TestBed.inject(AppComponent);
    datePipe = TestBed.inject(DatePipe);
    snackBar = TestBed.inject(MatSnackBar);
    boardServiceMock.getBoards.and.returnValue(of([]));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize taskLists', () => {
    expect(component.taskLists).toEqual([]);
  });

  it('should initialize boardId', () => {
    expect(component.boardId).toBe('');
  });

  it('should initialize mode', () => {
    expect(component.mode).toBe('board');
  });

  it('should initialize boardId and taskLists', async () => {
    const taskLists: TaskList[] = [{ id: 1, title: 'Task List 1',tasks:[]}];
    tasklistServiceMock.getTaskLists.and.returnValue(of(taskLists));
    await component.initialization();

    expect(component.boardId).not.toBeNull();
    expect(taskListService.getTaskLists).toHaveBeenCalledWith(component.boardId!!);
    expect(component.taskLists).toEqual(taskLists);
  });

  it('should open the add element dialog when click on addTaskList', () => {
    component.addTaskList();
    expect(dialogMock.open).toHaveBeenCalledWith(AddElementDialogComponent, { data: { 'title': '', 'type': 'list','editMode':false } });
  });

  it('should add a tasklist when closed add element dialog when click on addTaskList', () => {
    component.taskLists= [{ id: 1, title: 'Task List 1',tasks:[]}];
    component.addTaskList();
    expect(taskListService.createList).toHaveBeenCalled();
    expect(component.taskLists.length).toEqual(2);
  });
});
