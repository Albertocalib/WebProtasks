import {TaskList} from "./tasklist.model";
import {Tag} from "./tag.model";
import {File} from "./file.model";
import {User} from "./user.model";
import {Priority} from "./priority.model";
import {Message} from "./message.model";

export interface Task {
    id?: number;
    title: string;
    description?: string;
    position?: number;
    taskList?: TaskList;
    tag_ids?: Array<Tag>;
    attachments?: Array<File>,
    users?: Array<User>,
    subTasks?: Array<Task>;
    date_end?:Date
    priority?:Priority
    messages?:Array<Message>
    date_start_cycle_time?:Date;
    date_end_cycle_time?:Date;
    date_start_lead_time?:Date;
    date_end_lead_time?:Date;
}

