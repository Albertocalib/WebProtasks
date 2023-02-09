import {Task} from "./task.model";

export interface TaskList {
    id?: number;
    title: string;
    position?: number;
    tasks: Array<Task>;
}

