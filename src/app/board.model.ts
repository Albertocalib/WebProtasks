import {TaskList} from "./tasklist.model";

export interface Board {
    id?: number;
    name: string;
    photo: string;
    taskLists?:Array<TaskList>
}

