const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

const fs = require('fs');

// file I created
const Urls = require('../db/urls.json');

const short_urls = Urls;

// get the req.body as a json form
// app.use(bodyParser.json());
app.use(bodyParser.json({type: '*/*'}));
app.use(bodyParser.urlencoded({extended:true}));

// temporary storage -> later change it to db by connecting db using other module


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

// end-points
app.post(`/shorten`,checkIfOriginalUrlExist, (req, res)=>{
    console.log("req.body: ")
    console.log(req.body);
    console.log("res.shortUrlParam: ")
    console.log(res.shortUrlParam)
    const {originalUrl} = req.body;
    // generate shortUrl
    let shortUrlParam = generateShortUrl();
    // store original url into db
    shortUrlParam = checkIfShortUrlParamAlreadyExist(shortUrlParam);
    
    // if shortUrlParam is unique, store it in the list
    const url = {
        shortUrlParam:shortUrlParam,
        originalUrl:originalUrl
    }
    short_urls.push(url);
    const str_short_urls = JSON.stringify(short_urls);
    // write on Urls.json file
    fs.writeFile('../db/urls.json', str_short_urls, (err) =>{
        if(err){ throw err};
        console.log("urls.json is updated");
    } )


    res.status(200).json({
        success:true,
        url:url
    })
})

app.get(`/url/:shortUrlId`, (req, res) => {
    console.log(req.params)
    const{shortUrlId} = req.params;
    for(let i=0; i< short_urls.length; i++){
        if(short_urls[i].shortUrlParam === shortUrlId){
            let orignialUrl = short_urls[i].originalUrl;
            // return res.status(200).json(
            //     // {
            //     //     success:true,
            //     //     orignialUrl: orignialUrl,
            //     // }
            //     orignialUrl
            // )
            // return res.status(200).send(orignialUrl);
            return res.redirect(orignialUrl);
        }
    }
})
// set the port
const port = 3500;
app.listen(port, ()=> {
    console.log(`listening to the port ${port}`);
})

