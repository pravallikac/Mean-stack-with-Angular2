import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  RegisterForm : FormGroup; //<--- RegisterForm is of type FormGroup
  message;
  messageClass;    
  processing=false;    
  constructor(private fb: FormBuilder,
              private authService: AuthService
             ) // <--- inject FormBuilder 
    { 
        this.createForm();
    }

    createForm()
    {
        this.RegisterForm=this.fb.group({
            email:['', Validators.compose([Validators.required,
                                           Validators.minLength(5),
                                           Validators.maxLength(30),
                                           this.validateEmail
                                          ])
                  ], // <--- the FormControl called "email" defined by its initial data value, an empty string.
            username:['',Validators.compose([Validators.required,
                                           Validators.minLength(3),
                                           Validators.maxLength(15),
                                             this.validateUsername
                                          ]) 
                     ],
            password:['', Validators.compose([Validators.required,
                                           Validators.minLength(3),
                                           Validators.maxLength(10)
                                          ]) 
                     ],
            confirm:['', Validators.required ]
        },{validator:this.matchingPassword('password','confirm')});
    }
    
    disableForm(){
        this.RegisterForm.controls['email'].disable();
        this.RegisterForm.controls['username'].disable();
        this.RegisterForm.controls['password'].disable();
        this.RegisterForm.controls['confirm'].disable();
    }
    enableForm(){
        this.RegisterForm.controls['email'].enable();
        this.RegisterForm.controls['username'].enable();
        this.RegisterForm.controls['password'].enable();
        this.RegisterForm.controls['confirm'].enable();
    }
    
    validateEmail(controls){
        const regExp=new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
        if(regExp.test(controls.value)){
            return null;
        }else{
            return {'validateEmail':true}
        }
    }
    
    validateUsername(controls){
        const regExp=new RegExp(/^[a-zA-Z0-9]+$/);
        if(regExp.test(controls.value))
            {
                return null;
            }else{
                return {'validateUsername':true}
            }
    }
    
    matchingPassword(password,confirm)
    {
        return(group:FormGroup)=>{
            if(group.controls[password].value===group.controls[confirm].value)
                {
                    return null;
                }
            else{
                return {'matchingPassword':true}
            }
        }
    }
   
    onRegisterSubmit(){
        this.processing=true;
        this.disableForm();
        const user={
            email:this.RegisterForm.get('email').value,
            username:this.RegisterForm.get('username').value,
            password:this.RegisterForm.get('password').value
            
        }
//        console.log(this.RegisterForm.get('email').value);
//        console.log(this.RegisterForm.get('username').value);
//        console.log(this.RegisterForm.get('password').value);
//        console.log(this.RegisterForm.get('confirm').value);
//        //console.log("form submitted");
        this.authService.registerUser(user).subscribe(data=>{
            if(!data.success)
                {
                    this.messageClass='alert alert-danger';
                    this.message=data.message;
                    this.processing=false;
                    this.enableForm();
                }else{
                    
                    this.messageClass='alert alert-success';
                    this.message=data.message;
                }
            console.log(data);
        });
    }
    
  ngOnInit() {
  }

}

//<!--Explicitly declare the type of the RegisterForm property to be FormGroup; you'll initialize it later.
//Inject a FormBuilder into the constructor.
//Add a new method that uses the FormBuilder to define the RegisterForm; call it createForm.
//Call createForm in the constructor.-->
//FormBuilder.group is a factory method that creates a FormGroup.   FormBuilder.group takes an object whose keys and values are FormControl names and their definitions.