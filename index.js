const express = require('express');// Fast, unopinionated, minimalist web framework for node.
const app = express();// Initiate Express Application
const router=express.Router();// Creates a new router object.
const mongoose=require('mongoose');// Node Tool for MongoDB
const config=require('./config/database');// Mongoose Config
const path= require('path');// NodeJS Package for file path
const authentication=require('./routes/authentication')(router);// Import Authentication Routes
const bodyParser = require('body-parser');
const cors=require('cors');
//database connection
mongoose.Promise=global.Promise;
mongoose.connect(config.uri,(err)=>{
    if(err){
        console.log('could not connect to database',err);
    }
    else
        {
            
            console.log('connected to database:'+config.db);
        }
});

//Middleware

//To enable cross origin setup 
app.use(cors({
    origin:'http://localhost:4200'
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));// Provide static directory for frontend
app.use('/authentication',authentication);

// Connect server to Angular 2 Index.html
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080,()=>{console.log('listening on port 8080')});