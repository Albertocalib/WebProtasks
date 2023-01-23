import {TaskList} from "./tasklist.model";

export interface Task {
    id?: number;
    title: string;
    taskList?: TaskList;
}

