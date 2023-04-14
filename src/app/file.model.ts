import {Task} from "./task.model";
import {Board} from "./board.model";

export interface File {
    id?: number;
    name: string;
    type: string;
    content: string;
    task?:Task;
    board_ids?:Board[]
}
