import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Tag} from "../tag.model";
import {File} from "../file.model";
import {Task} from "../task.model";
import {TagService} from "../services/tag.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteElementDialogComponent} from "../DeleteElementDialog/delete.element.dialog.component";
import {TaskService} from "../services/task.service";
import {TaskList} from "../tasklist.model";
import {CopyOrMoveElementDialogComponent} from "../CopyOrMoveElementDialog/copyOrMove.element.dialog.component";

const EXTENSIONS_IMAGES:Set<String> = new Set(["jpg","jpeg","png","svg","img","heic"]);

@Component({
  selector: 'task-card',
  templateUrl: './taskCard.component.html',
  styleUrls: ['./taskCard.component.scss']
})
export class TaskCardComponent implements OnInit {

  title: string;
  tags: Array<Tag>;
  image: string;
  attachments: Array<File>;
  removable:boolean;
  @Input() task: Task | undefined;
  @Output() deleteTask = new EventEmitter<void>();
  @Output() copyTask = new EventEmitter<void>();
  @Output() moveTask = new EventEmitter<void>();

  constructor(public tagService: TagService, public taskService: TaskService,
              private _dialog: MatDialog
  ) {
    this.title=''
    this.tags = [];
    this.image='';
    this.attachments = [];
    this.removable=true;
  }

  ngOnInit() {
    this.attachments = this.task?.attachments!!
    this.title = this.task?.title!!
    this.tags = this.task?.tag_ids!!
    for (let attachment of this.attachments) {
      if (EXTENSIONS_IMAGES.has(attachment.type.toLowerCase())){
        this.image = `data:image/png;base64,${attachment.content}`
        break;
      }
    }
  }

  removeTag(t: Tag) {
    this.tagService.delete(t.id!!, this.task?.id!!)
      .subscribe(response => {
          let index = this.tags.indexOf(t)
          if (response) {
            let index = this.tags.indexOf(t)
            if (index !== -1) {
              this.tags.splice(index, 1);
            }
          }
        }
      )
  }


}


