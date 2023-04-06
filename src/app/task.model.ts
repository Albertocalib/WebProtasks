import {TaskList} from "./tasklist.model";
import {Tag} from "./tag.model";
import {File} from "./file.model";
import {User} from "./user.model";

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
    date_end?:Date;

}

