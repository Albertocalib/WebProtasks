import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BoardService} from "../services/board.service";
import {Board} from "../board.model";
import {AppComponent} from "../app.component";
import {AddElementDialogComponent} from "../AddElementDialog/add.element.dialog.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  templateUrl: './main.board.component.html',
  styleUrls: ['./main.board.component.css']
})
export class MainBoardComponent implements OnInit{
  boards : Board[]
  filteredBoards: Board[];
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
    this.appComponent.openBoard(board)
  }

  onInputChange(searchText: string){
    this.filteredBoards = this.boards.filter(board =>
      board.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  createBoard(){
    let dialogAddTask = this._dialog.open(AddElementDialogComponent, {
      data: {'title': '', 'description': '', 'type': 'board'}
    });
    dialogAddTask.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
      }
      })
  }
}



