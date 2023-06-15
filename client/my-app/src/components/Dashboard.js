import React, { useState } from 'react';
import { SubmitButton } from './SubmitButton';
import { OriginalUrlInput } from './OriginalUrlInput';
import { ShortenInput } from './ShortenInput';
import axios from 'axios';

const init_url = {originalUrl:"", shortenUrl:""};

export const Dashboard = () => {
    const [url, setUrl] = useState(init_url);

    const handleOnChangeOriginalUrl = (e) => {
        e.preventDefault();
        const {originalUrl} = e.currentTarget.value;
        setUrl({...url, [url.originalUrl]:originalUrl});
    }
    const getOriginalUrl = () => {
        return url.originalUrl;
    }
    const fetchShortenUrl = () => {
        // axios fetch from /shorten api
        axios.post("/shorten")
        .then(response => {
            const url = response.data.json();
            const shortUrl = url.shortUrl;
            setUrl({...url, [url.shortenUrl]: shortUrl})
        })
        .catch(error => {
            console.log("error: not able to fetch data")
        })
    }
    const createShortenUrl = () => {
        const original_url = getOriginalUrl();
        // get the shortenUrl from DB using fetch or axios
        const shortUrl = fetchShortenUrl(original_url);
        setUrl({...url, [url.shortenUrl]:shortUrl})
        return shortUrl;
    }
    const handleSubmit = (e, urlObj) => {
        e.preventDefault();
        // submit the urlObject to DB using post request
        submitUrl(urlObj);
        // return shorten url
        return urlObj.shortenUrl;

    }
    const submitUrl = () => {
        //axios : submit the url
        axios.post()
        
        //clear url information
        setUrl(init_url);
    }
    // const displayShortenUrl = () => {
    //     const shortUrl = url.shortenUrl;

    // }

    return (
        <>
            <OriginalUrlInput 
                handleOnChangeOriginalUrl={handleOnChangeOriginalUrl}
                originalUrl = {url.originalUrl}
            />
            <SubmitButton
                handleSubmit = {handleSubmit}
                getOriginalUrl = {getOriginalUrl}
                getShortenUrl = {createShortenUrl}
                url = {url}
            />
            <ShortenInput
                shortenUrl = {url.shortenUrl}
            />
        </>
    )
}