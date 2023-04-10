import {TaskList} from "./tasklist.model";
import {File} from "./file.model";

export interface Board {
    id?: number;
    name: string;
    photo: string;
    taskLists?:Array<TaskList>;
    file_id?:File;
}

