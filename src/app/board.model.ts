import {TaskList} from "./tasklist.model";
import {File} from "./file.model";
import {User} from "./user.model";
import {Rol} from "./rol.model";

export  interface  BoardUsersPermId{
  boardId: number
  userId: number
}
export interface BoardUsersPermRel{
  id: BoardUsersPermId
  board: Board
  user: User
  rol: Rol
}
export interface Board {
    id?: number;
    name: string;
    photo: string;
    taskLists?:Array<TaskList>;
    file_id?:File;
    users?:Array<BoardUsersPermRel>;
    wipActivated?:boolean;
    wipLimit?:number;
    wipList?:string;
    timeActivated?:boolean;
    cycleStartList?:string;
    cycleEndList?:string;
    leadStartList?:string;
    leadEndList?:string;

}

