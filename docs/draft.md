```js
// features
/*
feature:
1. getting a short url given original url
--------------------
property:
raw data || object: url
--------
functions:
- shortening a url given original url
function shorteningURL(o_url:string) -> s_url:string
{
    // get the domain
    // random_shortUrl = create random 8 digits [A-Z, a-z, 0-9]
    // random_shortUrl = generate8digits()
    while(!checkUrlIsUsed(random_shortUrl)){
        if true, re-create{
        generate8digits()
        }
    }
    return s_url;
}
// generate a 8 digits
function generate8digits(void):string{
    return generate 8 digits in string
}
// check if url is used already
function checkUrlIsUsed(short_url: string): boolean{
    return true if it is used
    return false if it is not used
}
--------
2. getting original url back given shorten url
---------------------
property:
raw data || object: url
-------------
functions:
- getting original url back given shorten url
function get_originalUrl(s_url:string) -> o_url:string

function get_originalUrl(s_url:string)-> o_url;string{
    // search for the object key === s_url in the list
    o_url = search_OriginalUrl(s_url)
    if there isn't, o_url === null,
        print("error: cannot find original_url")
    if there is,
        get the corresponding original url
    return the original url
}

function search_OriginalUrl(s_url:string) -> o_url:string||null{
    // search the object that has the key == s_url
    return o_url;
}
*/
```
