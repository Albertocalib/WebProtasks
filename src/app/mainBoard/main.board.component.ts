import {Component, OnInit, ViewChildren} from '@angular/core';
import {Router} from "@angular/router";
import {BoardService} from "../services/board.service";
import {Board} from "../board.model";
import {File} from "../file.model";
import {AppComponent} from "../app.component";
import {AddElementDialogComponent, AddElementDialogData} from "../AddElementDialog/add.element.dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatMenuTrigger} from "@angular/material/menu";


@Component({
  templateUrl: './main.board.component.html',
  styleUrls: ['./main.board.component.css']
})
export class MainBoardComponent implements OnInit{
  boards : Board[]
  filteredBoards: Board[];
  @ViewChildren(MatMenuTrigger) menuTriggers!:MatMenuTrigger[];
  constructor(
    public router: Router,
    public boardService: BoardService,
    private appComponent: AppComponent,
    private _dialog:MatDialog
  )
  {
    this.boards = []
    this.filteredBoards = []
  }


  ngOnInit(): void {
    this.boardService.getBoards().subscribe(
      (boards: Board[]) => {
        this.boards = boards
        this.filteredBoards = boards
        this.appComponent.boards = boards
      },error => console.log(error)
    );
  }
  openBoard(board:Board){
    if (!this.menuTriggers.some(trigger => trigger.menuOpen)) {
      this.appComponent.openBoard(board)
    }
  }

  onInputChange(searchText: string){
    this.filteredBoards = this.boards.filter(board =>
      board.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  createBoard(){
    let dialogAddTask = this._dialog.open(AddElementDialogComponent, {
      data: {'title': '', 'description': '', 'type': 'board', 'editMode':false}
    });
    dialogAddTask.afterClosed().subscribe(result => {
      if (result) {
        const file: File = {
          name: result.color ? result.color : result.photo_name,
          content: result.photo,
          type: result.color ? 'color' : 'img'
        };
        const b: Board = {
          name: result.title,
          photo: result.photo,
          file_id: file
        };
        this.boardService.createBoard(b).subscribe(board => {
          if (!this.boards) {
            this.boards = []
          }
          this.boards.push(board)
        });
      }
      })
  }

  deleteBoard(board:Board) {
    this.boardService.delete(board.id!!).subscribe(result => {
      let index = this.boards.indexOf(board)
      if (index !== -1) {
        this.boards.splice(index, 1);
      }
    });
  }
  copyBoard(board:Board) {
    this.boardService.copy(board.id!!)
      .subscribe(boardResponse => {
        this.boards.push(boardResponse)

      });

  }
  createBoardDialogConfig(board: Board): AddElementDialogData {
    return {
      title: board.name,
      description: '',
      type: 'board',
      editMode: true,
      photo: board.photo,
      color: board.file_id?.type === 'color' ? board.file_id?.name : undefined,
      photo_name: board.file_id?.type === 'img' ? board.file_id?.name : undefined
    };
  }

  editBoard(board: Board) {
    let config: AddElementDialogData = this.createBoardDialogConfig(board);
    let dialogAddTask = this._dialog.open(AddElementDialogComponent, { data: config });
    dialogAddTask.afterClosed().subscribe(result => {
      if (result) {
        if (board.file_id) {
          board.file_id.name = result.color ?? result.photo_name;
          board.file_id.content = result.photo;
          board.file_id.type = result.color ? 'color' : 'img';
        }
        board.name = result.title;
        this.boardService.updateBoard(board).subscribe(updatedBoard => {
          if (updatedBoard) {
            board.name = updatedBoard.name;
            board.photo = updatedBoard.photo;
            board.file_id = updatedBoard.file_id;
          }
        });
      }
    });
  }
}



