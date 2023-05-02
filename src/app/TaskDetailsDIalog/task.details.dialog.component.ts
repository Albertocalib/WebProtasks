import {Component, EventEmitter, Inject, Output, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TaskService} from "../services/task.service";
import {Task} from "../task.model";
import {User} from "../user.model";
import {Tag} from "../tag.model";
import {TagService} from "../services/tag.service";
import {getPriorityColor, Priority, getPriorityPrintableName} from "../priority.model";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Message} from "../message.model";
import {MessageService} from "../services/message.service";
import {ActivatedRoute} from "@angular/router";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER, SEMICOLON} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {AddElementDialogComponent} from "../AddElementDialog/add.element.dialog.component";

@Component({
  templateUrl: './task.details.dialog.component.html',
  styleUrls: ['./task.details.dialog.component.css']
})
export class TaskDetailsDialog implements OnInit{
  @Output() deleteClicked = new EventEmitter<Task>();
  @Output() copyClicked = new EventEmitter<Task>();
  @Output() moveClicked = new EventEmitter<Task>();
  removable:boolean;
  selectedPriority: Priority;
  priorities = Object.values(Priority);
  currentUser:User
  newMessage?:string
  boardTags?:Array<Tag>
  filteredTags?:Array<Tag>
  separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;
  task:Task
  boardId:string
  tagCtrl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsDialog>,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskService:TaskService,
    public tagService:TagService,
    public messageService:MessageService
  ) {
    dialogRef.disableClose = true;
    this.removable=true;
    this.task=data.task
    this.boardId=data.boardId
    this.selectedPriority= this.task.priority ? this.task.priority : Priority.NO_PRIORITY
    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
    this.tagService.getTagsInBoard(+this.boardId!!).subscribe(response =>{
      if (response){
        this.boardTags=response
        this._filterTags(null)
      }
    })

    this.tagCtrl.valueChanges.subscribe(value=>{
      this._filterTags(value)
    });
    this.tagCtrl.setValue(null);

  }
  private _filterTags(value:string| null){
    if (value!=null){
      this.filteredTags = this.boardTags?.filter(tag => tag.name.toLowerCase().includes(value) && this.task.tag_ids?.filter(t=>tag.id===t.id).length==0);
    }else{
      this.filteredTags = this.boardTags?.filter(tag => this.task.tag_ids?.filter(t=>tag.id===t.id).length==0);
    }
  }

  ngOnInit(): void {
    this.selectedPriority= this.task.priority ? this.task.priority : Priority.NO_PRIORITY
  }
  getPriorityPrintableName(priority:Priority){
    return getPriorityPrintableName(priority)
  }

  getPriorityFlagColor(priority:Priority){
    return getPriorityColor(priority)
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  submit(){
    this.dialogRef.close({})
  }
  move() {
    this.moveClicked.emit(this.task)
  }

  copy() {
    this.copyClicked.emit(this.task)
  }

  delete() {
    this.deleteClicked.emit(this.task)
  }


  removeUser(user:User) {
    this.taskService.removeAssigment(user.id!!, this.task?.id!!)
      .subscribe(response => {
          if (response) {
            let index = this.task.users?.indexOf(user)
            if (index!=null && index !== -1) {
              this.task.users?.splice(index, 1);
            }
          }
        }
      )
  }

  removeTag(t: Tag) {
    this.tagService.delete(t.id!!, this.task?.id!!)
      .subscribe(response => {
          if (response) {
            let index = this.task.tag_ids?.indexOf(t)
            if (index!=null && index !== -1) {
              this.task.tag_ids?.splice(index, 1);
              this._filterTags(null)
            }
          }
        }
      )
  }

  onChangeDate(event: MatDatepickerInputEvent<Date>) {
    this.task.date_end = event.value!!;
  }

  addMessage() {
    let newMessageCons = {body:this.newMessage,user:this.currentUser,task:this.task} as Message
    this.messageService.create(newMessageCons).subscribe(response => {
        if (response) {
          this.task.messages?.push(response)
          this.newMessage=undefined
        }
      }
    )

  }

  openSubTask(task: Task) {

  }

  addTag(event: MatChipInputEvent) {
    let dialogAddTask = this._dialog.open(AddElementDialogComponent, {
      data: {'title': event.value || '', 'type': 'tag'}
    });
    dialogAddTask.afterClosed().subscribe(result => {
      if (result) {
        let tag: Tag = {name:result.title, color:result.color}
        this.tagService.create(tag, +this.boardId).subscribe(result=>{
          if (result){
            this.tagService.addTagToTask(result.id!!,this.task.id!!).subscribe(response=>{
              if (response){
                this.task.tag_ids?.push(result);
                this._filterTags(null)
              }
            })
          }
        })
      }
    });
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);

  }

  addAssigment() {

  }



  selected(event: MatAutocompleteSelectedEvent): void {
    let tag = event.option.value
    this.tagService.addTagToTask(tag.id,this.task.id!!).subscribe(response=>{
      if (response){
        this.task.tag_ids?.push(event.option.value);
        this._filterTags(null)
      }
    })
    this.tagInput!!.nativeElement.value = '';

    this.tagCtrl.setValue(null);
  }

}



