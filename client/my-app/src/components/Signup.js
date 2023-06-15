import React, { useState } from 'react';

//sign up credential information
const init_signupCredential = {email:"", password:""};

export const Signup = ({
    submitSignUpCredential
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupCredential, setSignupCredential] = useState(init_signupCredential);

    const handleOnChange = (e) => {
        const {name, value} = e.currentTarget
        setSignupCredential({... signupCredential, [name]:value})
    }
    const handleClick = () => {
        submitSignUpCredential(signupCredential);
    }

    return (
        <>
        This is Signup page.
        <br/>
        <input name="email" value={email} onChange={handleOnChange}/>
        <input name="password" value={email} onChange={handleOnChange}/>
        <button onClick={handleClick}>Sign Up</button>
        </>
    )
}