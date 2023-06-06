import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardSettingsComponent } from '../app/boardSettings/board.settings.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../app/services/board.service';
import { TaskListService } from '../app/services/tasklist.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../app/shared.service';
import { AppComponent } from '../app/app.component';
import { TaskList } from '../app/tasklist.model';
import { Board } from '../app/board.model';
import { User } from '../app/user.model';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginService } from '../app/services/logIn.service';
import { Rol } from '../app/rol.model';
import { of } from 'rxjs';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('BoardSettingsComponent', () => {
  let component: BoardSettingsComponent;
  let fixture: ComponentFixture<BoardSettingsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTaskListService: jasmine.SpyObj<TaskListService>;
  let mockBoardService: jasmine.SpyObj<BoardService>;
  let mockUserService: jasmine.SpyObj<LoginService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let mockAppComponent: jasmine.SpyObj<AppComponent>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTaskListService = jasmine.createSpyObj('TaskListService', ['getTaskLists']);
    mockBoardService = jasmine.createSpyObj('BoardService', [
      'getBoards',
      'deleteUserFromBoard',
      'updateTime',
      'updateWip',
      'addUserToBoard',
      'updateRol',
    ]);
    mockUserService = jasmine.createSpyObj('LoginService', ['getAllUsers']);
    mockAppComponent = jasmine.createSpyObj('AppComponent', ['openBoard']);

    await TestBed.configureTestingModule({
      declarations: [BoardSettingsComponent],
      imports:[MatFormFieldModule,MatCheckboxModule,MatAutocompleteModule,MatCheckboxModule,
        MatInputModule,FormsModule,ReactiveFormsModule,BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TaskListService, useValue: mockTaskListService },
        { provide: BoardService, useValue: mockBoardService },
        { provide: LoginService, useValue: mockUserService },
        { provide: ActivatedRoute,
                useValue: {
                    paramMap: { subscribe: jasmine.createSpy('subscribe') },
                    params: { subscribe: jasmine.createSpy('subscribe').and.returnValue({id:1}) }
                }
        },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: SharedService, useValue: mockSharedService },
        { provide: AppComponent, useValue: mockAppComponent },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', async () => {
    const board:Board={id:1,name:'test1',photo:''}
    const mockTaskList: TaskList = { title: 'task-list',tasks:[],board:board };
    const mockUser: User = { id: 1, username: 'testuser', name: 'test' };

    mockTaskListService.getTaskLists.and.returnValue(of([mockTaskList]));
    mockBoardService.getBoards.and.returnValue(of([]));
    mockUserService.getAllUsers.and.returnValue(of([mockUser]));

    await component.initialization();

    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.taskLists).toEqual([mockTaskList]);
    expect(component.users).toEqual([mockUser]);
  });

  it('should delete user from board', () => {
    const mockBoard: Board = { id: 1, name: 'board-name',photo:'' };
    const mockUser: User = { id: 1, username: 'testuser', name: 'test' };

    mockBoardService.deleteUserFromBoard.and.returnValue(of(mockBoard));

    component.board = mockBoard;
    component.deleteUser(mockUser);

    expect(mockBoardService.deleteUserFromBoard).toHaveBeenCalledWith(mockBoard, mockUser.id!!);
    expect(mockAppComponent.board).toEqual(mockBoard);
    expect(component.board).toEqual(mockBoard);
  });

  it('should update time', () => {
    const mockBoard: Board = { id: 1, name: 'board-name',photo:'' };
    const mockCycleTimeStartField: TaskList = { title: 'cycle-start-list',tasks:[] };
    const mockCycleTimeEndField: TaskList = { title: 'cycle-end-list',tasks:[]  };
    const mockLeadTimeStartField: TaskList = { title: 'lead-start-list',tasks:[]  };
    const mockLeadTimeEndField: TaskList = { title: 'lead-end-list',tasks:[]  };

    mockBoardService.updateTime.and.returnValue(of(mockBoard));

    component.board = mockBoard;
    component.cycleTimeStartField = mockCycleTimeStartField;
    component.cycleTimeEndField = mockCycleTimeEndField;
    component.leadTimeStartField = mockLeadTimeStartField;
    component.leadTimeEndField = mockLeadTimeEndField;
    component.enableCycleLeadTimeCalculation = true;
    component.timeChanged();

    expect(mockBoardService.updateTime).toHaveBeenCalledWith(
      mockBoard,
      true,
      mockCycleTimeStartField.title,
      mockCycleTimeEndField.title,
      mockLeadTimeStartField.title,
      mockLeadTimeEndField.title
    );
    expect(mockAppComponent.board).toEqual(mockBoard);
    expect(component.board).toEqual(mockBoard);
  });

  it('should update WIP', () => {
    const mockBoard: Board = { id: 1, name: 'board-name',photo:'' };
    const mockWipListField: TaskList = { title: 'wip-list',tasks:[]  };
    const mockWipValue = 5;

    mockBoardService.updateWip.and.returnValue(of(mockBoard));

    component.board = mockBoard;
    component.wipListField = mockWipListField;
    component.wipValue = mockWipValue;
    component.enableWipCalculation=true;
    component.wipChanged();

    expect(mockBoardService.updateWip).toHaveBeenCalledWith(mockBoard, true, mockWipValue, mockWipListField.title);
    expect(mockAppComponent.board).toEqual(mockBoard);
    expect(component.board).toEqual(mockBoard);
  });

  it('should add user to board', () => {
    const mockBoard: Board = { id: 1, name: 'board-name',photo:'' };
    const mockRol: Rol = Rol.WATCHER;
    const mockEmailInput = 'test@example.com';

    mockBoardService.addUserToBoard.and.returnValue(of(mockBoard));

    component.board = mockBoard;
    component.rolSelected = mockRol;
    component.emailInput = mockEmailInput;
    component.inviteUsers();

    expect(mockBoardService.addUserToBoard).toHaveBeenCalledWith(mockBoard, mockRol, mockEmailInput);
    expect(component.board).toEqual(mockBoard);
    expect(component.rolSelected).toEqual(Rol.WATCHER);
    expect(component.emailInput).toEqual('');
    expect(component.inviteUsersDisabled).toBeTruthy();
  });

  it('should update role', () => {
    const mockBoard: Board = { id: 1, name: 'board-name',photo:'' };
    const mockUser: User = { id: 1, username: 'testuser', name: 'test' };
    const mockRol: Rol = Rol.WATCHER;

    mockBoardService.updateRol.and.returnValue(of(mockBoard));

    component.board = mockBoard;
    component.rolChanged(mockUser, mockRol);

    expect(mockBoardService.updateRol).toHaveBeenCalledWith(mockBoard, mockUser.id!!, mockRol);
    expect(component.board).toEqual(mockBoard);
  });
});
