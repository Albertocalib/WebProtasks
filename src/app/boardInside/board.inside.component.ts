import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaskList} from "../tasklist.model";
import {TaskListService} from "../services/tasklist.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  templateUrl: './board.inside.component.html',
  styleUrls: ['./board.inside.component.css']
})
export class BoardInsideComponent implements OnInit{
  taskLists : TaskList[]

  boardId : string | null
  constructor(
    public router: Router,
    public taskListService: TaskListService,
    private activateRoute: ActivatedRoute
  )
  {
    this.taskLists = []
    this.boardId=""
  }


  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((obs) => {
      if (obs.get('id')!=null){
        this.boardId = obs.get('id')
      }
    });
    this.taskListService.getTaskLists(this.boardId!!).subscribe(
      (lists: TaskList[]) => {
        console.log("Actualizar lista")
        this.taskLists = lists
      },error => console.log(error)
    );
  }

  drop(event: CdkDragDrop<TaskList[]>) {
    if (event.previousContainer === event.container) {
      console.log(event)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}



