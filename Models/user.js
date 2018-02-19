const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//validation
let emaillengthChecker=(email)=>{
    if(!email)
        {
            return false;
        }
    else{
        if(email.length<5 || email.length>30){
            return false;
        }
        else{
            return true;
        }
    }
};

let validEmailChecker=(email)=>{
    if(!email)
        {
            return false;
        }
    else{
        const regExp=new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
        return regExp.test(email);
    }
}

const emailValidators=[{validator:emaillengthChecker,
                       message:'E-mail must be atleast 5 characters but not more than 30'
                       },
                       {
                        validator:validEmailChecker,
                        message:'Must be a valid e-mail'
                       }
                      ];
let usernameLengthChecker=(username)=>{
    if(!username)
        {
            return false;
        }
    else{
        if(username.length<3 || username.length>15){
            return false;
        }else{
            return true;
        }
    }
};

let validateUsername=(username)=>{
    if(!username){
        return false;
    }else{
        const regExp=new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const usernameValidators=[{validator:usernameLengthChecker,
                           message:'Username must be atleast 3 charcaters but not more than 15'
                          },
                         {
                             validator:validateUsername,
                             message:'Username must not have special characters'
                         }
                        ];
let passwordLengthChecker=(password)=>{
    if(!password)
        {
            return false;
        }
    else{
        if(password.length<3||password.length>10)
            {
                return false;
            }
        else{
            return true;
        }
    }
};

const passwordValidator=[{
                          validator:passwordLengthChecker,
                          message:'Password must be atleast 3 charcaters but not more than 10'
                        }
                       ];

//Schema
  const userSchema = new Schema({
   email:{type:String,required:true,unique:true,lowercase:true,validate:emailValidators},
   username:{type:String,required:true,unique:true,lowercase:true,validate:usernameValidators},
    password:{type:String,required:true,validate:passwordValidator}  
    
  });

//middleware to encrypt the password

userSchema.pre('save',function(next){
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password,null,null,(err,hash)=> {
        if(err) return next(err);
           this.password=hash;
           next(); 
    });
});

//To decrypt the password
userSchema.methods.comparePassword=function(password){
    return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User', userSchema);