const User=require('../models/user');//Import User Model Schema
const jwt=require('jsonwebtoken');
const config=require('../config/database');

module.exports=(router)=>{
    
    router.post('/register',(req,res)=>{
        
        if(!req.body.email)
            {
                res.json({success:false,message:'you must provide an Email'});
            }
        else{
            if(!req.body.username)
                {
                    res.json({success:false,message:'You must provide Username'});
                }else
                    {
                        if(!req.body.password)
                            {
                              res.json({success:false,message:'You must provide Password'});  
                            }
                        else{
                            
                            let user=new User({
                                email:req.body.email.toLowerCase(),
                                username:req.body.username.toLowerCase(),
                                password:req.body.password
                            });
                            user.save((err)=>{
                                if(err){
                                    if(err.code===11000){
                                        res.json({success:false,message:'User or Email already exits'});
                                    }
                                    else
                                        {
                                            if(err.errors)
                                                {
                                                    if(err.errors.email)
                                                        {
                                                            res.json({success:false,message:err.errors.email.message});
                                                        }
                                                    else {
                                                        if(err.errors.username){
                                                            res.json({success:false,message:err.errors.username.message});
                                                        }
                                                        else{
                                                            if(err.errors.password){
                                                                res.json({success:false,message:err.errors.password.message});
                                                            }
                                                            else{
                                                                res.json({success:false,message:err});
                                                            }
                                                        }
                                                    }
                                                }else{
                                                    res.json({success:false,message:'Could not save User. Error: ',err});
                                                }
                                            
                                        }
                                    
                                }
                                else{
                                    res.json({success:true,message:'user registered successfully'});
                                }
                            })
                            
//                            console.log(req.body);
//                            res.send('registered successfully ');
                        }
                        
                    }
            
        }
        
    });
    
    router.post('/login',(req,res)=>{
       if(!req.body.username){
           res.json({success:false,message:'No username was provided'});
       } 
        else{
            if(!req.body.password){
                res.json({success:false,message:'No Password was provided.'});
            }else{
                User.findOne({username:req.body.username.toLowerCase()},(err,user)=>{
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                        if(!user){
                            res.json({success:false,message:'Username not found.'});
                        }else{
                            const validPassword=user.comparePassword(req.body.password);
                            if(!validPassword){
                                res.json({success:false,message:'Password invalid'});
                            }else{
                               
                               const token=jwt.sign({userId:user._id},config.secret,{expiresIn:'24h'}); res.json({success:true,message:'Success!',token:token,user:{username:user.username}});
                            }
                        }
                    }
                })
            }
        }
            
    });
    
    router.get('/profile',(req,res)=>{
       res.send('test'); 
    });
    return router;
}