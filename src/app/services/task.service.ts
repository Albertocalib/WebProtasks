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
    console.log(`ID=${id} , position=${position}, newTasklist=${newTaskListId}`)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<{t:Task}>(`${BASE_URL}id=${id}&newPosition=${position}&newTaskList=${newTaskListId}`,{},{headers})
      .pipe(map(response => response.t),catchError(error => this.handleError(error)));
  }

  private handleError(error: any) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.text());
  }
}
