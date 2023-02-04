import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Board} from "../board.model";
import {TaskList} from "../tasklist.model";

const BASE_URL = environment.apiEndpoint + "/list/";

@Injectable()
export class TaskListService {
  user:User
  constructor(private http: HttpClient) {
    this.user = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  getTaskLists(boardId:String): Observable<TaskList[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<TaskList[]>(`${BASE_URL}board=${boardId}`, {headers})
      .pipe(
        map(response => response),
        catchError(error => this.handleError(error))
      );
  }
  updatePosition(id:Number,position:Number):Observable<TaskList> {
    console.log(`ID=${id} , position=${position}`)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<{tl:TaskList}>(`${BASE_URL}id=${id}&position=${position}`,{},{headers})
      .pipe(map(response => response.tl),catchError(error => this.handleError(error)));
  }

  private handleError(error: any) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.text());
  }
}
