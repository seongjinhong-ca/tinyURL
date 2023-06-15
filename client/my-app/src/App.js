import logo from './logo.svg';
import './App.css';
import Router from './router/Router';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Landing } from './components/Landing';
import { useState } from 'react';


function App() {

  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  const reDirectToLoginPage = () => {
        
  }
  return (
    <div className="App">
      <Router>
        <Signup reDirectToLoginPage = {reDirectToLoginPage}/>
        <Login/>
        <Landing/>
      </Router>
    </div>
  );
}

export default App;
