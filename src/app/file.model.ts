import {Task} from "./task.model";

export interface File {
    id?: number;
    name: string;
    type: string;
    content: string;
    task?:Task;
}
