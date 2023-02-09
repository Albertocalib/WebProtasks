import {TaskList} from "./tasklist.model";

export interface Task {
    id?: number;
    title: string;
    description?: string;
    position?: number;
    taskList?: TaskList;
}

