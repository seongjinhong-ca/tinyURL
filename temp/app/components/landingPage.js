'use client';
// import { useEffect, useState } from 'react/cjs/react.production.min';
// import { useState } from 'react/cjs/react.production.min';
// import { useClient } from 'next/edge/client';
import React, { useState } from 'react';

const init_url = {originalUrl:"", shortenURL:""};
export default function LandingPage() {
      //useClient
    // useClient();
  const[url, setUrl] = useState(init_url);
  const[originalUrl, setOriginalUrl] = useState("");
  const[shortenUrl, setShortenUrl] = useState("");




  // create fetching function
  const getShortenUrl = async (originalUrl) => {
    // fetch the shorten url from server.js
    const response = await axios.post("/shorten", {originalUrl});
    return response.data;
  }
  // create submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    //get shorten url and update the shorten url.
    const shortenURL = getShortenUrl(originalUrl);
    setShortenUrl(shortenURL);
  }
 
  return (
    <div>
      <form method="post" onSubmit={handleSubmit}>
        <label>
          original url:
        </label>
        <input value={originalUrl} onChange={()=>{setOriginalUrl(e.currentTarget.value)}}/>
        <label>
          shorten url:
        </label>
        <input value={shortenUrl} onChange={()=>{setShortenUrl(e.currentTarget.value)}}/>
      </form>
    </div>
  )
}

