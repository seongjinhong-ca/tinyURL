import React, { useState } from 'react';

export const ShortenInput = ({
    shortenUrl
}) => {
    const [url, setUrl] = useState(shortenUrl);


    return (
        <>
            This is Shorten url section.
            <br/>
            <input value={url}/>
        </>
    )
}