import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Task} from "../task.model";
import {Priority} from "../priority.model";
import {File} from "../file.model";

const BASE_URL = environment.apiEndpoint + "/task/";

@Injectable()
export class TaskService {
  user:User
  constructor(private http: HttpClient) {
    this.user = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  updatePosition(id:number,position:number,newTaskListId:number):Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<Task>(`${BASE_URL}id=${id}&newPosition=${position}&newTaskList=${newTaskListId}`,{},{headers})
      .pipe(map(response => response),catchError(error => TaskService.handleError(error)));
  }
  createTask(task:Task, listId:number):Observable<Task> {
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
  removeAssigment(userId:number,taskId:number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}/user=${userId}`
    return this.http.delete<boolean>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }
  addAssigment(taskId:number,userId:number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}/user=${userId}`
    return this.http.post<boolean>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }
  updatePriority(taskId:number,priority:Priority){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}&newPriority=${priority}`
    return this.http.put<Task>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }
  updateDateEnd(taskId:number,newDate:Date){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}&newDateEnd=${newDate}`
    return this.http.put<Task>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }

  updateDescription(taskId:number,newDescription:string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}&newDescription=${newDescription}`
    return this.http.put<Task>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }
  updateTitle(taskId:number,newTitle:string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}&newTitle=${newTitle}`
    return this.http.put<Task>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }
  deleteSubTask(subtaskId:number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}ids=${subtaskId}`
    return this.http.delete<Task>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }
  createSubtask(subtask:Task,taskId:number):Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}newSubTask/task=${taskId}`
    return this.http.post<Task>(url, subtask, {headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }
  addAttachments(taskId:number,attachments:Set<File>){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}newAttachments/task=${taskId}`
    let body = Array.from(attachments)
    return this.http.post<Task>(url, body,{headers}).pipe(
      map(response => response),
      catchError(error => TaskService.handleError(error))
    );
  }

  private static handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.message);
  }
}
