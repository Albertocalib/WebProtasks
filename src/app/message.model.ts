import {Task} from "./task.model";
import {User} from "./user.model";

export interface Message {
    id?: number;
    body: string;
    user: User;
    task: Task;
}

