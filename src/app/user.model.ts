import {Rol} from "./rol.model";

export interface User {
    id?: number;
    name: string;
    password?:string;
    surname?:string;
    username?:string;
    email?:string;
    photo?:string;
}
