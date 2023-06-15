import React from 'react';

export const UrlConversion = ({isOnSubmit, handleIsOnSubmit, shortenUrl, handleSubmitOriginalUrl, handleSubmit}) => {
    return (
        <>
        URL UrlConversion
        <form onSubmit={handleSubmit}>
            <input value={isOnSubmit}/>
            <button type="Submit" onClick={handleSubmitOriginalUrl}>Submit</button>
        </form>
        <div>
            shorten url output:
            {shortenUrl}
        </div>
        </>
    )
}