import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Task} from "../task.model";
import {TaskList} from "../tasklist.model";

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
      .pipe(map(response => response),catchError(error => TaskService.handleError(error)));
  }
  createTask(task:Task, listId:Number):Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}newTask/listId=${listId}`
    console.log(url)
    return this.http.post<Task>(url, task, {headers}).pipe(
        map(response => response),
        catchError(error => TaskService.handleError(error))
      );
  }
  delete(taskId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}`
    return this.http.delete<boolean>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }

  copy(taskId: number,listId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}&taskListId=${listId}`
    return this.http.post<Task>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }

  move(taskId: number,listId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}&taskListId=${listId}`
    return this.http.put<Task>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }


  private static handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.message);
  }
}
