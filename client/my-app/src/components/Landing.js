import React, { useEffect, useState } from 'react';
import { UrlConversion } from "./components/UrlConversion";

const init_originalUrl = "";
const init_shortenUrl = "";
const init_isOnSubmit = false;

export const Landing = () =>{
    const [originalUrl, setOriginalUrl] = useState(init_originalUrl);
    const [shortenUrl, setShortenUrl] = useState(init_shortenUrl);
    const [isOnSubmit, setIsOnSubmit] = useState(init_isOnSubmit);
    
    // get shorten url
    useEffect(() => {
        // get shorten url from server
        const getShortenUrl = async (originalUrl) => {
            try{
                // get a response by giving a data == object
                const response = await fetch("/shorten", {
                    method:'POST',
                    headers:{
                        'Content-Type' : 'application/json',
                    },
                    body:JSON.stringify(originalUrl)
                });
                // convert the response to json format so that i can see object
                const jsonResponse = await response.json();
                setShortenUrl(jsonResponse);
            }catch (error){
                throw new Error('Network error for response');
            }
        }
        getShortenUrl(originalUrl);
    }, );

    const handleSubmitOriginalUrl = () => {
        
    }

    useEffect(()=>{


        // if isOnSubmit is true,
        if(isOnSubmit){
            // submit the original url to get a shortUrl
            handleSubmitOriginalUrl()
        }

    }, isOnSubmit)
    
    const handleIsOnSubmit = (e) => {
        e.preventDefault();
        setIsOnSubmit(true);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
    }
    return(
        <>
        This is landing page
        <UrlConversion
            isOnSubmit={isOnSubmit}
            handleIsOnSubmit={handleIsOnSubmit}
            shortenUrl= {shortenUrl}
            handleSubmitOriginalUrl = {handleSubmitOriginalUrl}
            handleSubmit = {handleSubmit}
        />
        <input name="original"/>
        </>
    )
}