import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Message} from "../message.model";

const BASE_URL = environment.apiEndpoint + "/message/";

@Injectable()
export class MessageService {
  user:User
  constructor(private http: HttpClient) {
    this.user = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  private static handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.message);
  }

  create(message:Message) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url=`${BASE_URL}newMessage/`
    return this.http.post<Message>(url, message,{headers}).pipe(
      map(response => response),
      catchError(error => MessageService.handleError(error))
    );
  }

}
