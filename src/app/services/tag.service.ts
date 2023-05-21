import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Tag} from "../tag.model";

const BASE_URL = environment.apiEndpoint + "/tag/";

@Injectable()
export class TagService {
  user:User
  constructor(private http: HttpClient) {
    this.user = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  private static handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.message);
  }

  delete(tagId: number,taskId:number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${tagId}/task=${taskId}`
    return this.http.delete<boolean>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TagService.handleError(error))
    );
  }
  getTagsInBoard(boardId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}board_id=${boardId}`
    return this.http.get<Array<Tag>>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TagService.handleError(error))
    );
  }
  addTagToTask(tagId: number,taskId:number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${taskId}/tag=${tagId}`
    return this.http.post<boolean>(url, {headers}).pipe(
      map(response => response),
      catchError(error => TagService.handleError(error))
    );
  }
  create(tag:Tag, boardId:number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}newTag/boardId=${boardId}`
    return this.http.post<Tag>(url, tag,{headers}).pipe(
      map(response => response),
      catchError(error => TagService.handleError(error))
    );
  }
}
