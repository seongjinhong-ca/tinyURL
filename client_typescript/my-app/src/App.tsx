import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Dashboard } from './components/Dashboard';
import { Router } from './Router/Router';

function App() {
  return (
    <div className="App">
      <Router>
        <Dashboard/>
      </Router>
    </div>
  );
}

export default App;
