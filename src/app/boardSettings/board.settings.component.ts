import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BoardService} from "../services/board.service";
import {lastValueFrom} from "rxjs";
import {TaskListService} from "../services/tasklist.service";
import {MatDialog} from "@angular/material/dialog";
import {SharedService} from "../shared.service";
import {AppComponent} from "../app.component";
import {TaskList} from "../tasklist.model";
import {Board} from "../board.model";
import {User} from "../user.model";
import {FormControl} from "@angular/forms";
import {LoginService} from "../services/logIn.service";
import {Rol} from "../rol.model";

@Component({
  templateUrl: './board.settings.component.html',
  styleUrls: ['./board.settings.component.css']
})
export class BoardSettingsComponent implements OnInit {
  enableCycleLeadTimeCalculation = false;
  enableWipCalculation = false;
  cycleTimeStartField?: TaskList;
  leadTimeStartField?: TaskList;
  cycleTimeEndField?: TaskList;
  leadTimeEndField?: TaskList;
  wipValue:number=0;
  wipListField?: TaskList;
  boardId:string
  taskLists: TaskList[]
  board?:Board
  users: User[]
  filteredUsers:User[]
  userCtrl = new FormControl('');
  inviteUsersDisabled=true
  rolSelected:Rol=Rol.WATCHER
  roles = Object.values(Rol)
  emailInput?:string

  constructor(
    public router: Router,
    public taskListService: TaskListService,
    private activateRoute: ActivatedRoute,
    private _dialog: MatDialog,
    private sharedService: SharedService,
    private appComponent: AppComponent,
    public boardService: BoardService,
    public userService: LoginService,
  ) {
    this.boardId = ""
    this.taskLists = []
    this.users = []
    this.filteredUsers = []
  }


  ngOnInit(): void {
    this.activateRoute.params.subscribe(async _ => {
      await this.initialization()
    });
  }

  async initialization() {
    this.activateRoute.paramMap.subscribe((obs) => {
      if (obs.get('id') != null) {
        this.boardId = obs.get('id')!!
      }
    });
    this.userService.getAllUsers().subscribe(users=>{
      this.users =users
    });
    this.userCtrl.valueChanges.subscribe(value=>{
      this._filterUsers(value)
    });
    try {
      this.taskLists = await lastValueFrom(this.taskListService.getTaskLists(this.boardId!!));
      if (this.taskLists.length > 0) {
        this.board = this.taskLists[0].board
        this.appComponent.board = this.board
        if (this.board?.wipList!!){
          this.wipListField=this.taskLists.filter(list=>list.title==this.board?.wipList!!)[0]
        }
        this.wipValue=this.board?.wipLimit!!
        this.enableWipCalculation = this.board?.wipActivated!!
        this.enableCycleLeadTimeCalculation = this.board?.timeActivated!!
        if (this.board?.cycleStartList!!){
          this.cycleTimeStartField = this.taskLists.filter(list=>list.title==this.board?.cycleStartList!!)[0]
        }
        if (this.board?.cycleEndList!!){
          this.cycleTimeEndField = this.taskLists.filter(list=>list.title==this.board?.cycleEndList!!)[0]
        }
        if (this.board?.leadStartList!!){
          this.leadTimeStartField = this.taskLists.filter(list=>list.title==this.board?.leadStartList!!)[0]
        }
        if (this.board?.leadEndList!!){
          this.leadTimeEndField = this.taskLists.filter(list=>list.title==this.board?.leadEndList!!)[0]
        }
      }
    } catch (error) {
      console.log(error);
    }
    if (this.appComponent.boards === undefined) {
      try {
        this.appComponent.boards = await lastValueFrom(this.boardService.getBoards());
      } catch (error) {
        console.log(error);
      }
    }
  }

  deleteUser(user:User) {
    this.boardService.deleteUserFromBoard(this.board!!,user.id!!).subscribe(boardR => {
      this.appComponent.board=boardR
      this.board=boardR
    })
  }

  timeChanged() {
    this.boardService.updateTime(this.board!!, this.enableCycleLeadTimeCalculation, this.cycleTimeStartField?.title!!,
      this.cycleTimeEndField?.title!!, this.leadTimeStartField?.title!!, this.leadTimeEndField?.title!!).subscribe(boardR => {
          this.appComponent.board=boardR
          this.board=boardR
    })
  }

  wipChanged() {
    this.boardService.updateWip(this.board!!, this.enableWipCalculation, this.wipValue, this.wipListField?.title!!).subscribe(boardR => {
      this.appComponent.board=boardR
      this.board=boardR
    })
  }

  addUser($event: any) {
    this.inviteUsersDisabled=false

  }

  private _filterUsers(value: string | null) {
    if (value!=null){
      const valueF = value.toLowerCase()
      this.filteredUsers = this.users?.filter(user => (user.name.toLowerCase().includes(valueF) ||
        user.surname?.toLowerCase().includes(valueF) || user.username?.toLowerCase().includes(valueF) ||
        user.email?.toLowerCase().includes(valueF)) && this.board!!.users?.filter(u=>user.id===u.user.id).length==0);
    }else{
      this.filteredUsers = this.users?.filter(user => this.board!!.users?.filter(u=>user.id===u.user.id).length==0);
    }
  }

  inviteUsers() {
    this.boardService.addUserToBoard(this.board!!,this.rolSelected,this.emailInput!!).subscribe(response=> {
      if (response) {
        this.board = response
      }
    });
    this.rolSelected=Rol.WATCHER;
    this.emailInput="";
    this.inviteUsersDisabled=true
  }

  rolChanged(user:User,rol:Rol) {
    this.boardService.updateRol(this.board!!,user.id!!,rol).subscribe(response=> {
      if (response) {
        this.board = response
      }
    });
  }
}



