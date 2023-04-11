import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "../user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";

const BASE_URL = environment.apiEndpoint + "/user/";

@Injectable()
export class LoginService {

  isLogged = false;
  user: User | undefined;
  auth: string | undefined;

  constructor(private http: HttpClient) {
    let user = JSON.parse(<string>localStorage.getItem('currentUser'));
    if (user) {
      this.setCurrentUser(user);
    }
  }

  logIn(user: string, pass: string) {
    let body = new URLSearchParams();
    body.set('username', user);
    body.set('password', pass);
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<User>(BASE_URL + 'logIn', body.toString(), options)
      .pipe(map(user => {

        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      }));
  }

  logOut() {
    this.removeCurrentUser();
  }

  setCurrentUser(user: User) {
    this.isLogged = true;
    this.user = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  removeCurrentUser() {
    localStorage.removeItem('currentUser');
    this.isLogged = false;
    this.user = undefined;
  }

  register(user: User): Observable<User> {
    const body = JSON.stringify(user);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<User>(BASE_URL + "register/newUser", body, {headers})
      .pipe(
        map(response => response),
        catchError(error => this.handleError(error))
      );
  }
  updatePhoto(photo:string): Observable<User> {
    const body = JSON.stringify(photo);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    debugger;
    const url =`${BASE_URL}updatePhoto/${this.user?.username}`
    return this.http.put<User>(url, body, {headers})
      .pipe(
        map(response => response),
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError("Server error (" + error.status + "): " + error.message);
  }
}
