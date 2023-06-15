import React, { useState } from 'react';

export const OriginalUrlInput = ({
    handleOnChangeOriginalUrl,
    originalUrl
}) => {
    const [url, setUrl] = useState(originalUrl);

    return (
        <>
            This is Original Input section.
            <br/>
            <input 
                value={url} 
                onChange={handleOnChangeOriginalUrl}
            />
        </>
    )
    
}