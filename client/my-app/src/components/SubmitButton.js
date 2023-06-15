import { get } from 'https';
import React, { useState } from 'react';

export const SubmitButton = ({
    handleSubmit,
    url,
    getOriginalUrl,
    createShortenUrl
}) => {
    const [urlObj, setUrlObj] = useState(url);

    const createUrlObject = (original, shorten) => {
        setUrlObj({...urlObj, [urlObj.originalUrl]:original, [urlObj.shortenUrl] : shorten});
    }
    return(
        <>
            This is Submit button section
            <br/>
            <button
                onClick={()=> {
                    const original_url = getOriginalUrl()
                    const shorten_url = createShortenUrl()
                    setUrlObj({
                        ...urlObj,
                        [urlObj.originalUrl]:original_url,
                        [urlObj.shortenUrl]:shorten_url
                    })
                    createUrlObject(urlObj.originalUrl, urlObj.shortenUrl);
                    handleSubmit(urlObj);
                }}
            >Submit</button>
        </>
    )

}