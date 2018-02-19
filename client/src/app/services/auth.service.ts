import { Injectable } from '@angular/core';
import {Http,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    
    domain="http://localhost:8080";
    authToken;
    user;

  constructor(private http:Http) { }

    registerUser(user){
        return this.http.post(this.domain+'/authentication/register',user).map(res=>res.json());
    }
    
    login(user){
        return this.http.post(this.domain+'/authentication/login',user).map(res=>res.json());
    }
    
    storeUserData(token,user){
        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(user));
        this.authToken=token;
        this.user=user;
    }
}
