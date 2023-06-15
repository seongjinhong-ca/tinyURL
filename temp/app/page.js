'use client';
import Image from 'next/image'
import styles from './page.module.css'
import LoginPage from './components/loginPage';
// import { useClient } from 'next/edge';
import Router from './router/Router';
import LandingPage from './components/landingPage';
import SignUpPage from './components/signUpPage';

export default function Home() {
  // useClient();
  // router
  return(
  <>
  <Router>
    <LoginPage/>
    <LandingPage/>
    <SignUpPage/>
  </Router>
  </>
  )
}
