// external modules I imported
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const session = require('express-session');

// const FileStore = require('session-file-store')(session);
// const MongoStore = require('connect-mongo');
const MongoDBStore = require('connect-mongodb-session')(session);

// get the key mongoURI from config/dev_key
const config = require("./config/dev_key");
// connect to mongoDB -> before create DB
// await mongoose.connect('mongodb://127.0.0.1:27017/test');
try{
    mongoose.connect(config.mongoURI, {})
    .then(
        ()=> {console.log('MongoDB connected')}
    );
} catch(err) {
    console.log("mongoDB not connected!")
    handleError(err);
}

const store = new MongoDBStore({
    uri: config.mongoURI,
    collection:'session'
})

// Node.js built-in module
const fs = require('fs');

// file I created
const Urls = require('../db/urls.json');
const expiryDates = require('../db/expiry.json');
const { Url } = require('./model/url');
const { User } = require('./model/User');

const short_urls = Urls;

// get the req.body as a json form
// app.use(bodyParser.json());
app.use(bodyParser.json({type: '*/*'}));
app.use(bodyParser.urlencoded({extended:true}));

const oneWeek = 1000 * 60 * 60 * 24 * 7
app.use(session({
    secret: 'my_secret',
    saveUninitialized: false, // need to identify user using session id
    cookie:{
        maxAge: 100,
    },
    resave:false, //don't save session if unmodified
    //store
    store:store
    // store: MongoStore.create({
    //     mongoUrl: config.mongoURI,
    //     // mongoOptions:advancedOptions,
    //     ttl: 24 * 60 * 60, // 1 days expiry,
    //     autoRemove:'disabled'
    // })
}))
// https://www.npmjs.com/package/connect-mongo
// https://www.npmjs.com/package/connect-mongodb-session


//login system
// to dos
/*
1. login
    -> end-pints : login, sign up (id, username),
    -> middle-wares: validatePassword, check unique username(id)
2. how to make a new short url(url giving to frontend) is unique
    -> going through array is not good there are too many urls
    -> 2 answers
        hints:
        0000 0000
        0000 0001
        [url10, url1, url2, ...]
        url10 = {_id:unique, counter:6}
        indexing database : _id, counter
        sorted list -> binary search
        binary search
3. real database -> MongoDB
4. AWS, GCP

500 < num of employees

*/

const createRandomString = (options) => {
    let eight_digits = "";
    let length = 8;
    for(let i=0; i < length; i++){
        eight_digits += options[Math.floor(Math.random() * options.length)]
    }
    const shortUrlParam = eight_digits;
    return shortUrlParam;
}
const generateShortUrl = () => {
    // const regex_option = /[A-Z][a-z][0-9]/g
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const options = [...uppers, ...lowers, ...nums];
    const shortUrlParam = createRandomString(options);
    return shortUrlParam;
}

const checkIfShortUrlParamAlreadyExist = (shortUrlParam) => {
    while(short_urls.includes(shortUrlParam)){
        shortUrlParam = generateShortUrl();
    }
    return shortUrlParam;
}

const checkIfOriginalUrlExist = (req, res, next) =>{
    const {originalUrl} = req.body;
    for(let i=0; i<short_urls.length; i++){
        // if original url has a corresponding short url,
        if(short_urls[i].originalUrl === originalUrl){
            // remove url object and re-create shortUrl and url object
            short_urls.splice(i, 1);
            let shortUrlParam = generateShortUrl();
            shortUrlParam = checkIfShortUrlParamAlreadyExist(shortUrlParam);
            console.log("shortUrlParam From checkIfOriginalExist: " + shortUrlParam);
            res.shortUrlParam = shortUrlParam;
        }
    }
    next();
}

const isValidUrl = (urlString) => {
    // make a regex object to validate the string
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

// validating url using new URL object : https://snyk.io/blog/secure-javascript-url-validation/
const validateItIsURL = (req, res, next) => {
    const{originalUrl} = req.body;
    let str_originalUrl = originalUrl.toString();
    // new URL from JavaScript built-in
    let inputURL;
    let valid_protocol;
    try{
        if(!isValidUrl(originalUrl)){
            inputURL = null;
            valid_protocol = null;
        }else{
            inputURL = new URL(originalUrl);
            valid_protocol = inputURL.protocol === "http:" || inputURL.protocol === "https:";
        }
    }
    catch (err){
        console.log("not https or http protocol.")
        console.log("Not Valid URL Error : ", err);
        inputURL = null;
        valid_protocol = null;
    }

    req.inputURL = inputURL;
    req.valid_protocol = valid_protocol;

    next();
}
// end-points
const sweep_toCheck_expiredUrl = async (req, res, next) => {
    // const {} = req.body;
    let now = Date.now();

    // req.remainingUsers = await Url.find({expiredAt:{$gte:now}}).exec();
    await Url.deleteMany({expiredAt:{$lte:now}})

    next();
}

app.post(`/shorten`, validateItIsURL, sweep_toCheck_expiredUrl, (req, res)=>{
    console.log("req.body: ")
    console.log(req.body);

    console.log("req.remainingUsers : ")
    console.log(req.remainingUsers)
    // console.log("res.shortUrlParam: ")
    // console.log(res.shortUrlParam)
    // check if it is valid url
    if(req.inputURL === null){
        return res.json({
            success:false,
            err_message: "Not Valid URL"
        })
    }
    // check if it has valid protocol
    if(req.valid_protocol === false){
        return res.json({
            success:false,
            err_message: "not valid protocol"
        })
    }
    const {originalUrl} = req.body;
    const str_originalUrl = JSON.stringify(originalUrl);
    console.log("str_originalUrl: ")
    console.log(str_originalUrl)
    // generate shortUrl
    let shortUrlParam = generateShortUrl();
    // store original url into db
    // shortUrlParam = checkIfShortUrlParamAlreadyExist(shortUrlParam);
    
    // produce createdAt
    const now = Date.now();
    let date = new Date();
    // produce expiredAt
    // const one_week = date.setDate(date.getDate() + 7);
    console.log("before 10 second -> date: ", date.getSeconds())
    const one_week = date.setSeconds(date.getSeconds() + 10);
    console.log("one week: ", one_week)


    // create an url object
    const urlObj = {
        shortUrl:shortUrlParam,
        originalUrl:originalUrl,
        expiredAt:one_week,
        createdAt:now,
        // add owner == user of the short url**********************
    
    }

    console.log("urlObj: ")
    console.log(urlObj);

    // try to push the result into MongoDB using mongoose
    const url = new Url({...urlObj});
    url.save().then((url)=>{
        console.log("url: ")
        console.log(url)
        return res.status(200).json(
            {
                success:true,
                url:url
            }
        )
    }).catch((err)=>{
        return res.json(
            {
                success:false,
                err:err
            }
        )
    })
})

app.get(`/url/:shortUrlId`,sweep_toCheck_expiredUrl, (req, res) => {
    console.log(req.params)
    const{shortUrlId} = req.params;

    let remainingUrls = req.remainingUrls;
    // const originalUrl = null;
    // for(let i=0; i< short_urls.length; i++){
    //     if(short_urls[i].shortUrlParam === shortUrlId){
    //         originalUrl = short_urls[i].originalUrl;
    //         // return res.status(200).json(
    //         //     // {
    //         //     //     success:true,
    //         //     //     originalUrl: originalUrl,
    //         //     // }
    //         //     originalUrl
    //         // )
    //         // return res.status(200).send(orignialUrl);
    //         // return res.status(302).redirect(originalUrl);
    //     }
    // }

    // try to get(find) an original url from mongoDB
    const original_url = null;
    Url.findOne({shortUrl:shortUrlId})
    .then((url) => {
        return res.status(302).redirect(url.originalUrl); // error!!!
    }).catch((err) => {
        console.log("short URL is deleted.")
        throw err
    })

    /*
    const original_url = null;
    try {
        original_url = (() => await Url.findOne({shortUrl:shortUrlId}));
    }catch (err){
        throw err
    }

    try catch block + async await + promise 비교
    */
    // once I get it, response with it -> redirect user to original url

    // res.status(200).json(
    //     {
    //         success:true,
    //         original_url:original_url
    //     }
    // )
})

const hashPassword = async (password) => {
    const saltRounds = 10;

    // create salt and then hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
// /users/register
app.post('/users/register', sweep_toCheck_expiredUrl, async (req, res)=>{
    // get the input from req.body
    console.log(res.body);
    const {email, password} = req.body;

    // create an object
    const userObj = {
        email: email,
        password: password,
    }

    // hash the password
    const hashedPassword = await hashPassword(password);
    console.log("hash : ", hashedPassword);
    
    userObj.password = hashedPassword;
    console.log("userObj : ", userObj);
    // hash the password
    // bcrypt.genSalt(saltRounds, function(err, salt) {
    //     bcrypt.hash(myPassword, salt, function(err, hash) {
    //         hashedPassword = hash;
    //         userObj.password = hashedPassword;
    //     });
    // });

    // create a model new Model()

    const user = new User(userObj);
    // -> since it has to go get a collection(table) from DB, I need to wait for IO asynchronously
    // do promise or await to handle asynchronous moment
    // save the model into database (or file system or localStorage)
    user.save().then((user)=>{
        return res.status(200).json({
            success:true,
            user:user
        })
    })
})

// helper functions for post('/users/login')
const checkPassword = async (inputHashedPassword, user) => {
    // decrypt user.password
    // compare with inputPassword
    console.log("type: ");
    const match = await bcrypt.compare(inputHashedPassword, user.password)
    return match;
    // if they are the same -> return true
    // if they are different -> re turn false
}

const checkUserExist = async (user) => {
    const {email, password} = user;

    let userFound = null;
    let retUser = {status:false, user: null, error:null};
    // User.findOne({email : user.email})
    // .then((user) =>{
    //     userFound = user;
    // })
    userFound = await User.findOne({email : user.email})
    console.log("userFound : ")
    console.log(userFound);
    // if user is found
    if(userFound !== null){
        // check if password is same
        const validPassword = await checkPassword(password, userFound);
        if(validPassword){
            retUser.status = true;
            retUser.user = userFound;
        }else if(validPassword === false){
            retUser.error = {
                success: false,
                statusCode: 401,
                err_message: "the password is not matching."
            }
        }
    }else if (userFound === null){
        retUser.error = {
            success:false,
            statusCode: 404,
            err_message: "user not found error"
        }
    }
    console.log("retUser : ")
    console.log(retUser);
    return retUser;
}

app.post('/users/login', sweep_toCheck_expiredUrl, async (req, res)=>{
    const {email, password} = req.body;
    // create user object
    const inputUser = {
        email: email,
        password: password,
    }
    // check if user exist, then return the user information
    // let ret_user = await checkUserExist(inputUser);
    let userDB = null;
    try{
        userDB = await checkUserExist(inputUser);
        console.log("userDB : ")
        console.log(userDB)
        // if ret_user is null === user is not found or password is wrong
        if(userDB.error !== null){
            if(userDB.error.statusCode === 404){
                return res.status(404).json({
                    success: false,
                    error: userDB.error.err_message
                })
            }else{
                return res.status(401).json({
                    success:false,
                    error: userDB.error.err_message
                })
            }
        }
        // if email and passwords are given as inputs == block from logging in
        if(email === null || password === null){
            if(email === null && password === null){
                console.log("password and email both are missing");
                res.status(401).send('Invalid credentials');
            }else if(email === null){
                console.log("email is missing");
                res.status(401).send('Invalid credentials');
            }else{
                console.log("password is missing");
                res.status(401).send('Invalid credentials');
            }
        }
        // if userDB.error === null -> user exist -> userDB !== null
        // && email and password are given as input

        // hash the input password to compare the user's hashed password
        const hashed = hashPassword(password);
        const str_hashedPassword = hashed.toString();
        if(userDB && checkPassword(str_hashedPassword, userDB.user)){
            // authenticate the user through session
            req.session.authenticated = true;
            req.session.userId = userDB.user._id;
            res.send("logged in successfully");
        }
    }catch(error){
        // server error
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
    // check if user is authenticated
    if(email && password){
        console.log(`req.session : `, req.session);
        if(req.session.user){
            res.json(req.session);
        }else{
            // hash the input password to compare the user's hashed password
            const hashed = hashPassword(password);
            const str_hashed = hashed.toString();
            // if input password and user's password are same, make session authenticated
            if(bcrypt.compare(str_hashed, userDB.user.password)){
                req.session.authenticated = true; // isLoggedIn == true
                req.session.user = {id: userDB.user._id, email: email};
                
                return res.status(200).json({
                    success: true,
                    user: {id: userDB.user._id, email:email},
                });
            }
            else{
                // not coming here******************
                return res.status(401).json({
                    success:false,
                    authenticationError : "user is not authenticated."
                })
            }
        }
    }else{
        if(email === null){
            return res.status(400).json({
                success:false,
                missingParameter:"user email is missing"
            })
        }else if(password === null){
            return res.status(400).json({
                success:false,
                missingParameter:"password is missing"
            })
        }
    }

    // if(ret_user.status){
    //     return res.status(200).json({
    //         success:true,
    //         user: ret_user
    //     })
    // }

    /*
    1.You attempt to log in using your credentials.
    2.Your login credentials are verified, and the server creates a session with a session ID for you. This session is stored in the database.
    3.Your session ID is stored in your browser (client) as a cookie.
    4.Upon subsequent requests, your cookie is verified against the session ID stored in the server. If it’s a match, the request is considered valid and processed.
    5.If you log out of an application, the session ID is destroyed on both the client and server sides.
    */
})

const decryptPassword = () => {
    

}

app.get('/users/logout', (req, res) => {
    // remove the authentication of a current user.
    req.session.destroy((err)=>{
        res.status(308).redirect('/');
    });
    

})
//************************** */
app.get('/users/me/profile', (req, res) => {
    const session = req.session;
    console.log("From /me/profile -> session: ", session);
    if(session.authenticated){
        return res.status(200).json({
            success:true,
            user: session.user
        })
    }else{
        return res.status(401).json({
            success:false,
            authError : "authentication error: the user is not authenticated."
        })
    }

})

//method 1 : rate limiter using npm package : https://www.npmjs.com/package/simple-rate-limiter
//method 2 : below
const max_requests = 20; // number of requests allowed
const time_interval = 60 * 1000 // 1000 * 60 = 1 second * 60
// init request numbers
let requestCount = 0;

function handleRequest(){
    // if number of requests exceed max_requests, exceed limit
    if(requestCount > max_requests){
        console.log("count exceed the limit!");
    }else if(requestCount === max_requests){
        console.log("the request reached the end!")
    }
    // if request count is less than max_request,
    // increase the request count
    requestCount++;
    // if the time interval ends, reset the count
    setTimeout(()=>{
        requestCount = 0;
        console.log("reset the count after time interval");
    }, time_interval)
}

// simple rate limiter made by me
function runRateLimiter(){
    for(let i=0; i< max_requests; i++){
        handleRequest();
    }
}

//******************************************************************* */
const createExpiryDate = () => {
    let creation_date = Date.now();
    let date = new Date();
    // get 7 days later date
    let expiry_date = date.setDate(date.getDate() + 7);
    let expiryDate = {creation_date: creation_date, expiry_date: expiry_date};
    return expiryDate;
}

/*
link:https://dev.to/rahmanfadhil/how-to-generate-unique-id-in-javascript-1b13
npm install uuid
const uuidv4 = require("uuid/v4")

uuidv4()

generating random string
link: https://futurestud.io/tutorials/generate-a-random-string-in-node-js-or-javascript

const Crypto = require('crypto')

function randomString(size = 21) {  
  return Crypto
    .randomBytes(size)
    .toString('base64')
    .slice(0, size)
}

console.log(  
  randomString()
)

link: https://github.com/agnoster/base32-js

*/

const expiry_list = expiryDates;
app.post(`/create_expiryDate`, (req, res)=>{
    // create expiryDate object
    const {date} = req.body;
    const expiryDate = createExpiryDate();
    console.log(expiryDate);
    // let randomId = Math.random()*1000 + 500000;
    // generate random values
    let random_str = generateShortUrl();
    // current date in seconds
    let now_str = Date.now().toString();
    // combine random_str + now_str
    const randomId = random_str.concat("_", now_str);
    console.log("randomId: ")
    console.log(randomId);
    // create
    let expiry = {id:randomId, ...expiryDate};
    // store expiry in expiry_list and stringify
    expiry_list.push(expiry);
    const str_expiry_list = JSON.stringify(expiry_list);
    // save it in file === store in file
    fs.writeFile('../db/expiry.json', str_expiry_list, (err) =>{
        if(err){
            throw err;
        }
        console.log("expiry.json updated with new expiry object");
    })
    // return
    res.status(200).json(expiry);
})

app.get(`/get_expiryDate/:expiryDate_id`, (req, res)=>{
    // get the expiryDate object
    let expiry_id = req.params['expiryDate_id'];
    let list_expiry = expiryDates;
    console.log(list_expiry);
    let i = 0;
    let err_message = "";
    while(i < list_expiry.length && list_expiry[i].id !== expiry_id){
        i = i + 1;
    }
    // if expiry date is not found until the end of the list
    if(i >= list_expiry.length){
        err_message = err_message.concat("not able to find the id for givin expiry date");
        return res.status(404).json({
            success: false,
            err: err_message
        })
    }
    // if expiry date is found
    let expiryDate = list_expiry[i];
    res.status(200).json({
        success:true,
        expiry_date : expiryDate
    })
})
app.delete(`/delete_expiryDate/:expiryDate_id`, (req, res)=>{
    // delete the expiryDate object
    // const {expiryDate_id} = req.params.expiryDate_id;
    const expiryDate_id = req.params.expiryDate_id;
    console.log("expiryDate_id DELETE CURL: ")
    console.log(expiryDate_id);
    let list_expiryDates = expiryDates;
    for(let i=0; i < list_expiryDates.length; i++){
        if(list_expiryDates[i].id === expiryDate_id){
            let index = list_expiryDates.indexOf(i);
            // remove the object
            list_expiryDates = list_expiryDates.splice(index, 1);
            let str_list_expiryDates = JSON.stringify(list_expiryDates);
            // save it into file
            fs.writeFile("../db/expiry.json", str_list_expiryDates, (err)=>{
                if(err){
                    throw err
                }
            })
            return res.status(200).json({
                success: true,
                message: `the expiryDate with id, ${expiryDate_id}, is removed`
            })
        }
    }
    // if ExpiryDate is not found
    res.status(404).json({
        success: false,
        err: `The expiry date with ${expiryDate_id} is not found`
    })
})

// set the port
const port = 3500;
app.listen(port, ()=> {
    console.log(`listening to the port ${port}`);
})

