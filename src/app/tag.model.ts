import {Task} from "./task.model";
import {Board} from "./board.model";

export interface Tag {
    id?: number;
    name: string;
    color?: number;
    tasks?: Array<Task>;
    board?:Board;
}

