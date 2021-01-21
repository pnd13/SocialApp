import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl='https://localhost:44349/api/';

  private currentUserSouce=new ReplaySubject<User>(1); //stores only 1 user as an observable
  currentUser$=this.currentUserSouce.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response:User)=>{
        const user=response;
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSouce.next(user);
        }
      })
      )
  }

  register(model: any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User)=>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSouce.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    this.currentUserSouce.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSouce.next(null);
  }
}
