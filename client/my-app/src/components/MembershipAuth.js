import React, { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// this component has a global variables of login and sign up
const init_userAuth = {email:"", password:""};

export const MembershipAuth = () => {
    const [isLoginPage, setIsLoginPage] = useState(true);
    const [userAuth, setUserAuth] = useState(init_userAuth);
    const history = useHistory();

    const gotoLoginPage = () => {
        history.push('/login');
    }
    const reDirectToLoginPage = () => {
        history.push("/login");
    }
    // submit signup credential
    const submitSignUpCredential = (signupCredential) => {
        const email = signupCredential.email;
        const password = signupCredential.password;
        // axios : give signupCredential to DB
        axios.post();
        // switch to login page
        reDirectToLoginPage();
    }

    return (
        <>
            {isLoginPage ?
            gotoLoginPage()
            :
            <Signup submitSignUpCredential = {submitSignUpCredential}/>}
        </>
    )
}