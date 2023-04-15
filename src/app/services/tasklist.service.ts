import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {TaskList} from "../tasklist.model";

const BASE_URL = environment.apiEndpoint + "/list/";

@Injectable()
export class TaskListService {
  user:User
  constructor(private http: HttpClient) {
    this.user = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  getTaskLists(boardId:string): Observable<TaskList[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<TaskList[]>(`${BASE_URL}boardId=${boardId}`, {headers})
      .pipe(
        map(response => response),
        catchError(error => TaskListService.handleError(error))
      );
  }
  updatePosition(id:number,position:number):Observable<TaskList> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<{tl:TaskList}>(`${BASE_URL}id=${id}&position=${position}`,{},{headers})
      .pipe(map(response => response.tl),catchError(error => TaskListService.handleError(error)));
  }

  private static handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.message);
  }

  createList(list:TaskList,boardId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}newList/boardId=${boardId}`
    return this.http.post<TaskList>(url, list, {headers}).pipe(
      map(response => response),
      catchError(error => TaskListService.handleError(error))
    );
  }

  delete(listdId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${listdId}`
    return this.http.delete<boolean>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskListService.handleError(error))
    );
  }

  copy(listId: number,boardDestId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${listId}&boardDestId=${boardDestId}`
    return this.http.post<TaskList>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskListService.handleError(error))
    );
  }

  move(listId: number,boardDestId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${listId}&boardDestId=${boardDestId}`
    return this.http.put<TaskList>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TaskListService.handleError(error))
    );
  }

}
