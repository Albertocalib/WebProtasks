import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Board} from "../board.model";
import {Rol} from "../rol.model";

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

  createBoard(board:Board):Observable<Board> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}newBoard/username=${this.user.username}`
    return this.http.post<Board>(url, board, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  delete(boardId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${boardId}`
    return this.http.delete<boolean>(url, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  copy(boardId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}copyBoard/boardId=${boardId}`
    return this.http.post<Board>(url, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  updateBoard(board:Board):Observable<Board> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}updateBoard/${board.id}`
    return this.http.put<Board>(url, board, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  updateWip(board:Board, wipActivated:boolean, wipLimit:number, wipList:string):Observable<Board> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${board.id}/wipActivated=${wipActivated}&wipLimit=${wipLimit}&wipList=${wipList}`
    return this.http.put<Board>(url, board, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  addUserToBoard(board:Board, rol:Rol, username:string):Observable<Board> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${board.id}/username=${username}&rol${rol}`
    return this.http.put<Board>(url, board, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  updateRol(board:Board, userId:number, role:Rol):Observable<Board> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${board.id}/userId=${userId}&role=${role}`
    return this.http.put<Board>(url, board, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  deleteUserFromBoard(board:Board, userId:number):Observable<Board> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}id=${board.id}/userId=${userId}`
    return this.http.delete<Board>(url, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  updateTime(board: Board, timeActivated: boolean, cycleStart: string, cycleEnd: string, leadStart: string, leadEnd: string): Observable<Board> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url = `${BASE_URL}id=${board.id}/timeActivated=${timeActivated}&cycleStart=${cycleStart}&cycleEnd=${cycleEnd}&leadStart=${leadStart}&leadEnd=${leadEnd}`
    return this.http.put<Board>(url, board, {headers}).pipe(
      map(response => response),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.message);
  }

}
