import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Task} from "../task.model";

const BASE_URL = environment.apiEndpoint + "/task/";

@Injectable()
export class TaskService {
  user:User
  constructor(private http: HttpClient) {
    this.user = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  updatePosition(id:Number,position:Number,newTaskListId:Number):Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<Task>(`${BASE_URL}id=${id}&newPosition=${position}&newTaskList=${newTaskListId}`,{},{headers})
      .pipe(map(response => response),catchError(error => this.handleError(error)));
  }
  createTask(task:Task, listId:Number):Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}newTask/listId=${listId}`
    console.log(url)
    return this.http.post<Task>(url, task, {headers}).pipe(
        map(response => response),
        catchError(error => this.handleError(error))
      );
  }


  private handleError(error: any) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.text());
  }
}
