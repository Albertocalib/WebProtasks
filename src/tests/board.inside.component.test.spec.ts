import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app/app.component';
import { AddElementDialogComponent } from '../app/AddElementDialog/add.element.dialog.component';
import { BoardService } from '../app/services/board.service';
import { SharedService } from '../app/shared.service';
import { Task } from '../app/task.model';
import { TaskList } from '../app/tasklist.model';
import { TaskListService } from '../app/services/tasklist.service';
import { TaskService } from '../app/services/task.service';
import { DatePipe } from '@angular/common';

import { BoardInsideComponent } from '../app/boardInside/board.inside.component';
import { of, throwError} from "rxjs";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('BoardInsideComponent', () => {
  let component: BoardInsideComponent;
  let taskListService: TaskListService;
  let tasklistServiceMock: SpyObj<TaskListService>
  let boardServiceMock: SpyObj<BoardService>
  let dialogMock: SpyObj<MatDialog>
  let taskServiceMock: SpyObj<TaskService>


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
        },
        updatePosition:{}
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
    taskServiceMock = createSpyObj("TaskService",["updatePosition"])
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
          useValue: taskServiceMock
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
    taskListService = TestBed.inject(TaskListService);
    boardServiceMock.getBoards.and.returnValue(of([]));
    spyOn(console, 'log');
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

  it('should update the position of a task', () => {
    const id = 1;
    const position = 2;
    const listId = 3;
    taskServiceMock.updatePosition.and.returnValue(of({} as Task));

    component.updatePositionTask(id, position, listId);

    expect(taskServiceMock.updatePosition).toHaveBeenCalledWith(id, position, listId);
  });

  it('should handle the error when updating task position', () => {
    const id = 1;
    const position = 2;
    const listId = 3;
    const error = 'Error updating task position';
    taskServiceMock.updatePosition.and.returnValue(throwError(error));
    component.updatePositionTask(id, position, listId);
    expect(taskServiceMock.updatePosition).toHaveBeenCalledWith(id, position, listId);
    expect(console.log).toHaveBeenCalledWith(error);
  });

  it('should update the position of a task list', () => {
    const id = 1;
    const position = 2;
    tasklistServiceMock.updatePosition.and.returnValue(of({} as TaskList));
    component.updatePositionTaskList(id, position);
    expect(taskListService.updatePosition).toHaveBeenCalledWith(id, position);
  });

  it('should handle the error when updating task list position', () => {
    const id = 1;
    const position = 2;
    const error = 'Error updating task list position';
    tasklistServiceMock.updatePosition.and.returnValue(throwError(error));
    component.updatePositionTaskList(id, position);

    expect(taskListService.updatePosition).toHaveBeenCalledWith(id, position);
    expect(console.log).toHaveBeenCalledWith(error);
  });


});
