import {Task} from "./task.model";
import {Board} from "./board.model";

export interface TaskList {
    id?: number;
    title: string;
    position?: number;
    tasks: Array<Task>;
    board?:Board;
}

