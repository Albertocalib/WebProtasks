import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Board} from "../board.model";

const BASE_URL = environment.apiEndpoint + "/board/";

@Injectable()
export class BoardService {
  user:User
  constructor(private http: HttpClient) {
    this.user = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  getBoards(): Observable<Board[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<Board[]>(`${BASE_URL}username=${this.user.username}`, {headers})
      .pipe(
        map(response => response),
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: any) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.text());
  }
}
