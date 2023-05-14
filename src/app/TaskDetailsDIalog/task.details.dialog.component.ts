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
import {MatChipInputEvent} from "@angular/material/chips";
import {ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {AddElementDialogComponent} from "../AddElementDialog/add.element.dialog.component";
import {LoginService} from "../services/logIn.service";
import {File as FileModel, FileExtensions} from "../file.model"

@Component({
  templateUrl: './task.details.dialog.component.html',
  styleUrls: ['./task.details.dialog.component.css']
})
export class TaskDetailsDialog implements OnInit{
  @Output() deleteClicked = new EventEmitter<Task>();
  @Output() copyClicked = new EventEmitter<Task>();
  @Output() moveClicked = new EventEmitter<Task>();
  @Output() openSubTaskClicked = new EventEmitter<Task>();
  removable:boolean;
  selectedPriority: Priority;
  priorities = Object.values(Priority);
  currentUser:User
  newMessage?:string
  boardTags?:Array<Tag>
  boardUsers?:Array<User>
  filteredUsers?:Array<User>
  filteredTags?:Array<Tag>
  separatorKeysCodes: number[] = [ENTER];
  createTag:Tag = {name:'Crear nueva Etiqueta'}
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('assigmentInput') assigmentInput: ElementRef<HTMLInputElement> | undefined;
  task:Task
  boardId:string
  tagCtrl = new FormControl('');
  assigmentCtrl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsDialog>,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskService:TaskService,
    public tagService:TagService,
    public messageService:MessageService,
    public loginService:LoginService,
    private fileExtensions:FileExtensions
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
    this.loginService.getUsersInBoard(+this.boardId!!).subscribe(response =>{
      if (response){
        this.boardUsers=response
        this._filterAssigments(null)
      }
    })
    this.assigmentCtrl.valueChanges.subscribe(value=>{
      this._filterAssigments(value)
    });
    this.assigmentCtrl.setValue(null);

    this.tagCtrl.valueChanges.subscribe(value=>{
      this._filterTags(value)
    });
    this.tagCtrl.setValue(null);
    this._formatTaskDateEnd()

  }
  private _filterTags(value:string| null){
    if (value!=null){
      const valueF = value.toLowerCase()
      this.filteredTags = this.boardTags?.filter(tag => tag.name.toLowerCase().includes(valueF) && this.task.tag_ids?.filter(t=>tag.id===t.id).length==0);
    }else{
      this.filteredTags = this.boardTags?.filter(tag => this.task.tag_ids?.filter(t=>tag.id===t.id).length==0);
    }
    this.filteredTags?.push(this.createTag)
  }
  private _filterAssigments(value:string| null){
    if (value!=null){
      const valueF = value.toLowerCase()
      this.filteredUsers = this.boardUsers?.filter(user => (user.name.toLowerCase().includes(valueF) ||
        user.surname?.toLowerCase().includes(valueF) || user.username?.toLowerCase().includes(valueF) ||
        user.email?.toLowerCase().includes(valueF)) && this.task.users?.filter(u=>user.id===u.id).length==0);
    }else{
      this.filteredUsers = this.boardUsers?.filter(user => this.task.users?.filter(u=>user.id===u.id).length==0);
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
    this.taskService.updateDateEnd(this.task.id!!,event.value!!).subscribe(response=>{
      if (response){
        this.task=response
        this._formatTaskDateEnd()
      }
    })
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
    this.openSubTaskClicked.emit(task)
  }

  async addTag(event: MatChipInputEvent) {
    await this.createTagDialog(event.value || '')
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);

  }
  private createTagDialog(title:string){
    let dialogAddTask = this._dialog.open(AddElementDialogComponent, {
      data: {'title': title, 'type': 'tag'}
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
  }



  selected(event: MatAutocompleteSelectedEvent): void {
    let tag = event.option.value
    if (tag==this.createTag){
      this.createTagDialog(this.tagInput!!.nativeElement.value || '')
    }
    this.tagService.addTagToTask(tag.id,this.task.id!!).subscribe(response=>{
      if (response){
        this.task.tag_ids?.push(event.option.value);
        this._filterTags(null)
      }
    })
    this.tagInput!!.nativeElement.value = '';

    this.tagCtrl.setValue(null);
  }

  selectedAssigment(event: MatAutocompleteSelectedEvent) {
    this.taskService.addAssigment(this.task.id!!,event.option.value.id!!).subscribe(response=>{
      if (response){
        this.task.users?.push(event.option.value);
        this._filterAssigments(null)
      }
    })
    this.assigmentInput!!.nativeElement.value = '';

    this.assigmentCtrl.setValue(null);
  }

  selectPriority(priority:Priority) {
    this.taskService.updatePriority(this.task.id!!,priority).subscribe(response=>{
      if (response){
        this.task=response
        this._formatTaskDateEnd()
      }
    })
  }

  descriptionChange() {
    this.taskService.updateDescription(this.task.id!!,this.task.description!!).subscribe(response=>{
      if (response){
        this.task=response
        this._formatTaskDateEnd()
      }
    })

  }

  onTitleChange(event: Event) {
    const newValue = (event.target as HTMLElement).innerText;
    this.taskService.updateTitle(this.task.id!!,newValue).subscribe(response=>{
      if (response){
        this.task=response
        this._formatTaskDateEnd()
      }
    })
  }
  private _formatTaskDateEnd(){
    if (this.task.date_end)
      this.task.date_end=new Date(this.task.date_end)
  }

  createSubTask() {
    let dialogAddTask = this._dialog.open(AddElementDialogComponent, {
      data: {'title': '', 'description': '', 'type': 'subtask', 'editMode':false}
    });
    dialogAddTask.afterClosed().subscribe(result => {
      if (result) {
        let t: Task = {
          title: result.title,
          description: result.description,
        }
        this.taskService.createSubtask(t, this.task.id!!).subscribe(task => {
          if (task){
            this.task=task
            this._formatTaskDateEnd()
          }
        })
      }
    })
  }
  _getImageExtensionFromAttachment(attachment:FileModel){
    let type = ""
    if (attachment.type) {
      type = attachment.type.toLowerCase()
    }
    let image="../../unknown_icon.png"
    if (type=="pdf"){
      image = "../../assets/pdf_logo.png"
    }else if (type=="zip" || type=="rar") {
      image = "../../assets/zip_logo.png"
    }else if (this.fileExtensions.EXTENSIONS_WORD.has(type)){
      image = "../../assets/word_logo.png"
    }else if (this.fileExtensions.EXTENSIONS_EXCEL.has(type)){
      image = "../../assets/excel_logo.png"
    }else if (this.fileExtensions.EXTENSIONS_IMAGES.has(type)){
      image = `data:image/png;base64,${attachment.content}`
    }
    return image
  }

  downloadAttachment(attachment:FileModel) {
    let content = `data:application/octet-stream;base64,${attachment.content}`

    const downloadLink = document.createElement('a');
    downloadLink.href = content
    downloadLink.download = attachment.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  addAttachments(files: FileList|null) {
    if (!files){
      return
    }
    let setFiles = new Set<FileModel>();
    let filePromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      let reader = new FileReader();
      reader.readAsDataURL(file);

      const promise = new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          const base64file = (reader.result as string).split(',')[1];
          const typeList = file.name.split('.')
          const extension = typeList[typeList.length - 1]
          let newFile: FileModel = {
            name: file.name,
            type: extension,
            content: base64file
          }
          setFiles.add(newFile);
          resolve();
        };

        reader.onerror = () => {
          reject(reader.error);
        };
      });

      filePromises.push(promise);
    }
    Promise.all(filePromises)
      .then(() => {
        this.taskService.addAttachments(this.task.id!!,setFiles).subscribe(result=>{
          if (result){
            this.task=result
            this._formatTaskDateEnd()
          }
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
}



