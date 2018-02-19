import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, FormControl,Validators } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    messageClass;
    message;
    processing=false;
    LoginForm:FormGroup;
  constructor(private formBuilder:FormBuilder,
              private authService:AuthService,
              private router:Router
              ) 
    {
      this.createForm();
    }

    createForm(){
        this.LoginForm=this.formBuilder.group({
            username:['',Validators.required],
            password:['',Validators.required]
        });
    }
    
    disableForm(){
        this.LoginForm.controls['username'].disable();
        this.LoginForm.controls['password'].disable();
        
    }
    
    enableForm(){
        this.LoginForm.controls['username'].enable();
        this.LoginForm.controls['password'].enable();
    }
    
    onLoginSubmit(){
        this.processing=true;
        this.disableForm();
        const user={
            username:this.LoginForm.get('username').value,
            password:this.LoginForm.get('password').value
        }
        
        this.authService.login(user).subscribe(data=>{if(!data.success){
            this.messageClass='alert alert-danger';
            this.message=data.message;
            this.processing=false;
            this.enableForm();
        }else{
            this.messageClass='alert alert-success';
            this.message=data.message;
            this.authService.storeUserData(data.token,data.user);
            setTimeout(()=>{
                this.router.navigate(['/dashboard']);
            },2000);
        }})
    }
  ngOnInit() {
  }

}
