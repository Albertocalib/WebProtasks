import {Task} from "./task.model";

export interface TaskList {
    id?: number;
    title: string;
    photo: string;
    tasks: Array<Task>;
}

