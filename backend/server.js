// external modules I imported
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

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

// temporary storage -> later change it to db by connecting db using other module


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

/*
shortening url:

ref LinkL: https://medium.com/@sandeep4.verma/system-design-scalable-url-shortener-service-like-tinyurl-106f30f23a82

ref link to makeid: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id

ref link to adding current ip address : https://studio3t.com/knowledge-base/articles/mongodb-atlas-login-ip-whitelisting/#:~:text=To%20whitelist%20multiple%20IP%20addresses,Whitelist%20Entry%2C%20then%20click%20Confirm.
https://studio3t.com/knowledge-base/articles/mongodb-atlas-login-ip-whitelisting/

1. load balancer
2. url model:
{
    short url
    original url
    creation date
    expiry date
    api key
    user id
}


*/
// rate limiting system design
/*
link: https://blog.logrocket.com/rate-limiting-node-js/
*/

//https://javascript.info/url
//https://askjavascript.com/how-to-convert-url-to-string-in-javascript/#:~:text=To%20convert%20a%20URL%20to,()%20or%20encodeURI()%20methods.
//https://stackoverflow.com/questions/3568921/how-to-remove-part-of-a-string
// using regex : https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
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
const validateItIsURL = () => {
    const{originalUrl} = req.body;
    let str_originalUrl = originalUrl.toString();
    // new URL from JavaScript built-in
    let inputURL;
    try{
        inputURL = new URL(originalUrl);
    }
    catch (err){
        console.log("Not Valid URL Error : ", err);
        return false;
    }
    let valid_protocol = inputURL.protocol === "http:" || inputURL.protocol === "https:";
}
// end-points
const sweep_toCheck_expiredUrl = () => {
    for (let i=0; i< short_urls.length; i++){
        let now = new Date.now();
        if (short_urls[i].expiredAt <= now){
            // removed from mongodb
        }
    }
}

app.post(`/shorten`, (req, res)=>{
    console.log("req.body: ")
    console.log(req.body);
    // console.log("res.shortUrlParam: ")
    // console.log(res.shortUrlParam)
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
    const one_week = date.setDate(date.getDate() + 7);


    // create an url object
    const urlObj = {
        shortUrl:shortUrlParam,
        originalUrl:originalUrl,
        expiredAt:one_week,
        createdAt:now,
        // add owner == user of the short url
    
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

app.get(`/url/:shortUrlId`, (req, res) => {
    console.log(req.params)
    const{shortUrlId} = req.params;

    const originalUrl = null;
    for(let i=0; i< short_urls.length; i++){
        if(short_urls[i].shortUrlParam === shortUrlId){
            originalUrl = short_urls[i].originalUrl;
            // return res.status(200).json(
            //     // {
            //     //     success:true,
            //     //     originalUrl: originalUrl,
            //     // }
            //     originalUrl
            // )
            // return res.status(200).send(orignialUrl);
            // return res.status(302).redirect(originalUrl);
        }
    }

    // try to get(find) an original url from mongoDB
    const original_url = null;
    Url.findOne({shortUrl:shortUrlId})
    .then((url) => {
        return res.status(302).redirect(url.originalUrl);
    }).catch((err) => {
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
app.post('/users/register', async (req, res)=>{
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

const checkPassword = async (inputPassword, user) => {
    // decrypt user.password
    console.log("type: ");
    const match = await bcrypt.compare(inputPassword, user.password)
    return match;
    // compare with inputPassword
    // if they are the same -> return true
    // if they are different -> re turn false
}
const checkUserExist = async (user) => {
    const {email, password} = user;

    let userFound = null;
    let retUser = {status:false, user: null};
    // User.findOne({email : user.email})
    // .then((user) =>{
    //     userFound = user;
    // })
    userFound = await User.findOne({email : user.email})
    console.log("userFound : ")
    console.log(userFound);
    if(userFound !== null){
        // check if password is same
        const validPassword = await checkPassword(password, userFound);
        if(validPassword){
            retUser.status = true;
            retUser.user = userFound;
        }
    }
    console.log("retUser : ")
    console.log(retUser);
    return retUser;
}
app.post('/users/login', async (req, res)=>{
    const {email, password} = req.body;
    // create user object
    const inputUser = {
        email: email,
        password: password,
    }
    // check if user exist, then return the user information
    let ret_user = await checkUserExist(inputUser);
    console.log("ret_user : ")
    console.log(ret_user)
    if(ret_user.status){
        return res.status(200).json({
            success:true,
            user: ret_user
        })
    }
})

const decryptPassword = () => {

}
app.get('/users/logout', (req, res) => {
    decryptPassword()

})

app.get('/users/me/profile', (req, res) => {

})

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

