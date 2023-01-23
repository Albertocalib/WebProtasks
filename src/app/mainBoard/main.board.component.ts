import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BoardService} from "../services/board.service";
import {Board} from "../board.model";


@Component({
  templateUrl: './main.board.component.html',
  styleUrls: ['./main.board.component.css']
})
export class MainBoardComponent implements OnInit{
  boards : Board[]
  constructor(
    public router: Router,
    public boardService: BoardService
  )
  {
    this.boards = []
  }


  ngOnInit(): void {

    this.boardService.getBoards().subscribe(
      (boards: Board[]) => {
        console.log(boards)

        this.boards = boards
      },error => console.log(error)
    );
  }
}



