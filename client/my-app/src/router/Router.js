import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom;'
// import { Login } from '../components/Login';

const Router = ({children}) => {
    const {login, signup, landing} = children;

    return(
        <>
        This is router.js
        <BrowserRouter>
            <header>
                <nav>

                </nav>
            </header>
            <main>
                <Routes>
                    <Route path="/login" element={login}/>
                    <Route path="/signup" element={signup}/>
                    <Route path="/landing"element={landing}/>
                </Routes>
            </main>
        </BrowserRouter>
        </>
    )
}

export default Router;