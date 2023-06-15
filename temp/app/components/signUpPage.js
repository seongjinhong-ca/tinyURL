'use client';
import Image from 'next/image'
// import styles from './page.module.css'
// import { useEffect, useState } from 'react/cjs/react.production.min';
// import { useState } from 'react/cjs/react.production.min';
// import { useClient } from 'next/edge';
import React, { useState, useEffect } from 'react';
import { signUpuser } from '@/utils/auth';
import { useRouter } from 'next/router';

const init_signUpInfo = {email:"", password:""};
export default function SignUpPage() {
    // useClient();
  const [signUpInfo, setSignUpInfo]= useState(init_signUpInfo);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  // const setOnChange = (e) = {
  //   // e.currentTarget not working
  //   // const {name, value} = e.currentTarget.value;
  //   setLoginInfo({...loginInfo, [e.currentTarget.name]:e.currentTarget.value})
  // }

  // use axios instead
  async function fetchData(){
    const res = await fetch("/users/register");
    // if not fetched
    if(! res.ok){
      throw new Error("Failed to fetch data");
    }
    return res.json();
  }

  useEffect(() => {
    fetchData();
  },[]);

  // event deprecated -> so i have to use e instead
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    // validate user
    
    // sign up the user
    signUpuser(email, password);
    // return back to login page
    router.push("/login");
    // setIsSubmitted(true);
  }

  return (
    <>
      <div>
        <h1 className={styles.title}>
          signUp page
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
            <button type="submit">signUp</button>
            <button>go back to login</button>

          </form>
        </div>
      </div>
    </>
    
  )
}
