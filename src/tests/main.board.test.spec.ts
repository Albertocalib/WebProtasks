import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { of } from 'rxjs';
import { MainBoardComponent } from '../app/mainBoard/main.board.component';
import { BoardService } from '../app/services/board.service';
import { Board } from '../app/board.model';
import { AppComponent } from '../app/app.component';
import { AddElementDialogComponent } from '../app/AddElementDialog/add.element.dialog.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import SpyObj = jasmine.SpyObj;

describe('MainBoardComponent', () => {
  let component: MainBoardComponent;
  let fixture: ComponentFixture<MainBoardComponent>;
  let mockBoardService: SpyObj<BoardService>;
  let mockAppComponent: SpyObj<AppComponent>;
  let dialogMock: SpyObj<MatDialog>
  let mockBoards: Board[]



  beforeEach(async () => {
    mockBoardService = jasmine.createSpyObj('BoardService', ['getBoards', 'createBoard', 'delete', 'copy', 'updateBoard']);
    mockAppComponent = jasmine.createSpyObj('AppComponent', ['openBoard']);
    dialogMock = jasmine.createSpyObj('MatDialog', {
      open: {
        afterClosed: function () {
          return {
            subscribe: function (callback: ReturnType<any>) {
              callback( {  title: 'Board', photo_name:'abcd.jpg',photo: 'photo3.jpg' })
            }
          }
        }
      }
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule,MatFormFieldModule,
        MatInputModule,MatIconModule,MatCardModule,MatMenuModule,BrowserAnimationsModule],
      declarations: [MainBoardComponent],
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: AppComponent, useValue: mockAppComponent },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    mockBoards = [
      { id: 1, name: 'Board 1', photo: 'photo1', file_id: { name: 'file1', content: 'content1', type: 'img' } },
      { id: 2, name: 'Board 2', photo: 'photo2', file_id: { name: 'file2', content: 'content2', type: 'img' } }
    ];
    mockBoardService.getBoards.and.returnValue(of(mockBoards));
    fixture = TestBed.createComponent(MainBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get boards and set filteredBoards', () => {
    mockBoardService.getBoards.and.returnValue(of(mockBoards));

    component.ngOnInit();

    expect(mockBoardService.getBoards).toHaveBeenCalled();
    expect(component.boards).toEqual(mockBoards);
    expect(component.filteredBoards).toEqual(mockBoards);
    expect(mockAppComponent.boards).toEqual(mockBoards);
  });

  it('should open board when no menu triggers are open', () => {
    mockAppComponent.openBoard.and.stub();

    component.openBoard(mockBoards[0]);

    expect(mockAppComponent.openBoard).toHaveBeenCalledWith(mockBoards[0]);
  });


  it('should filter boards by name', () => {
    component.boards = mockBoards;

    component.onInputChange('Board 1');

    expect(component.filteredBoards).toEqual([mockBoards[0]]);
  });

  it('should create a board', () => {
    const newBoard: Board = { name: 'Board', photo: 'photo3.jpg', file_id: Object({ name: 'abcd.jpg', content: 'photo3.jpg', type: 'img' }) };
    mockBoardService.createBoard.and.returnValue(of(newBoard));

    component.createBoard();

    expect(dialogMock.open).toHaveBeenCalledWith(AddElementDialogComponent, {
      data: { title: '', description: '', type: 'board', editMode: false }
    });
    expect(mockBoardService.createBoard).toHaveBeenCalledWith(newBoard);
    expect(component.boards).toEqual([mockBoards[0], mockBoards[1], newBoard]);
  });

  it('should delete a board', () => {
    const boardToDelete = mockBoards[0];
    mockBoardService.delete.and.returnValue(of(true));


    component.deleteBoard(boardToDelete);

    mockBoardService.delete(boardToDelete.id!!).subscribe(result => {
      expect(result).toBeTrue();
      expect(component.boards.length).toEqual(1);
    });
  });

  it('should copy a board', () => {
    const boardToCopy = mockBoards[0];
    const copiedBoard: Board = { id: 3, name: 'Board 1 (Copy)', photo: 'photo1', file_id: { name: 'file1', content: 'content1', type: 'img' } };
    mockBoardService.copy.and.returnValue(of(copiedBoard));

    component.copyBoard(boardToCopy);

    expect(mockBoardService.copy).toHaveBeenCalledWith(boardToCopy.id!!);
    expect(component.boards.length).toEqual(3);
  });

  it('should create a board dialog config', () => {
    const board = mockBoards[0];

    const config = component.createBoardDialogConfig(board);

    expect(config).toEqual({
      title: board.name,
      description: '',
      type: 'board',
      editMode: true,
      photo: board.photo,
      color: undefined,
      photo_name: 'file1'
    });
  });

});
