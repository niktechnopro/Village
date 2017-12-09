const express = require('express');
const http = require('http');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql')
const request_module = require('request');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const swal = require('sweetalert');

// const io = require('socket.io');
// const apiai = require('apiai')('35c622ace8eb4059b215441b08650a5d')//apiai token
// const geocode = require('./geocode/geocode.js'); //module to extract lat,lng from zip code
const port = process.env.PORT || 3000; //configures to available port based on
//enviroment variable or port 3000 by default - for easier management

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false})); //what is urlencoded ?

//here is a key:value pair (declaring the engine I'd like to use for view)
app.set('view engine', 'ejs');
// setup database
var db = mysql.createConnection({ 
    // connectionLimit: 50, maximum connections to databse
    host: '127.0.0.1',
    user: 'admin',
    password: 'password',
    database: 'DB_VILLAGE'
})

db.connect ((error) => { //connecting to our database
    if (error){
        console.log(error)
        console.log('could not connect to database')
        // throw error;// commented out so the server would not crash
        return;
    }else{
        console.log("connection to db = success!");
    }
})


var server = http.createServer(app);
const date = new Date()

app.use((req, res, next) => { //logging info about date, location and method used
    var now = date.toString();
    var log = `${now}: ${req.url} ${req.method}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (error) => { //where '\n' is a new line character
        if (error) { console.log("unable to append to server log") }
    });
    next();
});

//creating static path from the root of our harddrive to public folder
app.use(express.static(__dirname + '/public'));

//the following to serve welcome page
app.get('/', (req, res) => {
    console.log('someone came to our page')
    res.render('index', {
        dateNow: date.toDateString(),
    })
});

//serves front login page and veryfies if user in database
app.post('/loginForm', (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    console.log("this is what received from form: ", email, password)
    //next we are going to get info from parents table with email and password
    const selectQuery = `SELECT pw, child_name, gender FROM parents WHERE email = ?;`;
    db.query(selectQuery, [email],(error, results)=>{
        if (error){
            console.log('something went wrong with this db request');
            return
        }else{
            //if results is an empty array - user is not in database and must register 
            console.log("retreived: ", results[0].child_name, results[0].pw, results[0].gender);
            if (results.length == 0){
                //this is a new user - insert them - user must register
                res.render('index', {
                onLoad: 2   
                })  
            }else{
                //results are NOT empty array
                console.log('users email is in database')
                let child_name = results[0].child_name;
                let compareTo = results[0].pw;
                let gender = results[0].gender;
                // console.log('retrieved hashed password from db:', compareTo);
                //compare what retrieved from DB to what enetered - returns 'true' if passwords match
                var passwordMatch = bcrypt.compareSync(password, compareTo)
                console.log(passwordMatch);
                    if (passwordMatch){
                        // User information is in database
                        console.log('retrieved child_name from db', child_name);
                        (gender==='boy') ? child="images/iconKid.svg" : child="images/iconKid2.png";
                        console.log(child)
                        res.render('chatBot',{
                            greeting: `Hello ${child_name}!`,
                            child_avatar: child
                        });
                    }else{
                        console.log('passwords do not match retype the password correctly')
                        res.render('index', {
                            onLoad: 1
                        })
                    }
            } 
        }
    })
    // res.send('I got something here')
});

//reading from registration form
app.post('/registerForm', (req, res)=>{
    console.log('receiving data from registration page')
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password2;
    const child_name = req.body.child_name;
    const relationship = req.body.relationship;
    const child_username = req.body.child_username;
    const fav_color = req.body.favorite_color;
    const gender = req.body.boygirl;

    const hash = bcrypt.hashSync(password);
    console.log(first_name, last_name, email, password, child_name, relationship, child_username, gender)
    const selectQuery = `SELECT pw,child_name FROM parents WHERE email = ?;`;
    // console.log(hash);
    const dbQuery = db.query(selectQuery, [email],(error, results)=>{
        // console.log(dbQuery);
        //did this return a row? If so, the user already exists
        if (results.length != 0){
            console.log("user's child is in database, must login now: ", child_name)
            res.render('index',{
                onLoad: 1
             });
        }else{
            //this is a new user - insert them - user must register
            console.log('user must be inserted')
            const insertQuery = `INSERT INTO parents (first_name, last_name, email, pw, child_name, relationship, child_username, fav_color, gender) VALUES (?,?,?,?,?,?,?,?,?);`;
            // const childQuery = `SELECT child_name FROM parents where email = ?;`;
            db.query(insertQuery, [first_name, last_name, email, hash, child_name, relationship, child_username, fav_color, gender], (error)=>{
                if (error){
                    console.log('error inserting into database')
                    // throw error;
                    return
                }else{
                    console.log('succesful insertion into databse, automatic login next');
                    console.log('child_name: ', child_name );
                    //serving the right avatar for a child
                    (gender==='boy') ? child="images/iconKid.svg" : child="images/iconKid2.png"
                    console.log(child);
                    res.render('chatBot',{
                        greeting: `Hello ${child_name}`,
                        child_avatar: child
                    });
                    
                }
            })
        }
    })
})
    

server.listen(port, (error) => {
    (error) ? console.log("your code sucks"): console.log(`listening on port ${port}`);
});