'use client';
import Image from 'next/image'
// import styles from './page.module.css'
// import { useEffect, useState } from 'react/cjs/react.production.min';
// import { useState } from 'react/cjs/react.production.min';
// import { useClient } from 'next/edge';
import React, { useState, useEffect } from 'react';
import { loginuser } from '@/utils/auth';
import SignUpPage from './signUpPage';

const init_loginInfo = {email:"", password:""};
export default function LoginPage() {
    // useClient();
  const [loginInfo, setLoginInfo]= useState(init_loginInfo);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const setOnChange = (e) = {
  //   // e.currentTarget not working
  //   // const {name, value} = e.currentTarget.value;
  //   setLoginInfo({...loginInfo, [e.currentTarget.name]:e.currentTarget.value})
  // }

  useEffect(() => {
    setEmail()

  }, [password, email]);

  // // use axios instead
  // async function fetchData(){
  //   const res = await fetch("https://");
  //   // if not fetched
  //   if(! res.ok){
  //     throw new Error("Failed to fetch data");
  //   }
  //   return res.json();
  // }

  // event deprecated -> so i have to use e instead
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    loginuser(email, password);
    setEmail("");
    setPassword("");
  }

  const goToSignPage = () => {

    return (
        <SignUpPage/>
    )
  }

  return (
    <div>
      <h1 className={styles.title}>
        tiny URL generator
      </h1>
      <div className={styles.loginInfo}>
        <form action="/verify-login" method="post" onSubmit={handleSubmit}>
          <div className="email-input">
            <label for="email">
              email:
            </label>
            <input
            type="text"
            name="email"
            value = {email}
            onChange={()=> {setEmail(e.currentTarget.value)}}/>
          </div>
          <div className="password-input">
            <label for="password">
              password:
            </label>
            <input
            type="text"
            name="password"
            value = {password}
            onChange={()=> {setPassword(e.currentTarget.value)}}/>
          </div>
          <button type="submit">login</button>
          <button type="click" onClick={goToSignPage}> sign up</button>

        </form>
      </div>
    </div>
  )
}
