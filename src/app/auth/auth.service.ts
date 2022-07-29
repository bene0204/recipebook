import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
  kind?: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({providedIn: 'root'})
export class AuthService{
  apiKey = 'AIzaSyAsqYcl3qBOQWEUJVdgDwobuFbR8CKmd8c';
  signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
  loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
  
  user = new BehaviorSubject<User>(null);
 
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
    private router: Router){}

  signUp(email: string, password: string){
    return this.http.post<AuthResponseData>(this.signUpUrl + this.apiKey,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),tap(resData => {
        this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
    }));
  }

  login(email:string, password: string) {
    return this.http.post<AuthResponseData>(this.loginUrl + this.apiKey, 
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),tap(resData => {
          this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      }))
      
  }

  autoLogin(){
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token, 
      new Date(userData._tokenExpirationDate)
      );

    if(loadedUser.token){
      const expiresIn: number = loadedUser.tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expiresIn);
      this.user.next(loadedUser);
    }

  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  private handleAuth(email: string, userId: string,  token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(
      email, 
      userId, 
      token, 
      expirationDate
      );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000)
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error occured.'
        if(!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'Email already in use.';
            break;

          case 'EMAIL_NOT_FOUND':
            errorMessage = 'Wrong email or password.'
            break;
          
          case 'INVALID_PASSWORD':
            errorMessage = 'Wrong email or password.'
            break;
        }
        return throwError(errorMessage);
  }
}