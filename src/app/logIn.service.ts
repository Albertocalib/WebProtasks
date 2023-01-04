import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from "./user.model";
import {Observable, throwError} from "rxjs";
import {environment} from "../environments/environment";

const BASE_URL = environment.apiEndpoint + "/user/";

@Injectable()
export class LoginService {

   isLogged = false;
   user: User | undefined;
   auth: string | undefined;

    constructor(private http: HttpClient) {
        let user = JSON.parse(<string>localStorage.getItem('currentUser'));
        if (user) {
            console.log('Logged user');
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
      return this.http.post<User>(BASE_URL+'logIn',body.toString(),options)
            .pipe(map(user => {

                if (user) {
                    this.setCurrentUser(user);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logOut() {

        return this.http.get(BASE_URL+'logOut').pipe(
            map(response => {
                this.removeCurrentUser();
                return response;
            }),
        );
    }

    private setCurrentUser(user: User) {
        this.isLogged = true;
        this.user = user;
        console.log(this.user)
    }

    removeCurrentUser() {
        localStorage.removeItem('currentUser');
        this.isLogged = false;
    }
    register(user: User):Observable<User> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        const body = JSON.stringify(user);
        return this.http.post<User>(BASE_URL+"register",body,{headers})
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
