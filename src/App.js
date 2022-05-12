import React, { useEffect } from 'react';
import './App.css';
import Login from './components/login';
import HomePage from './components/HomePage'
import {Route,Routes} from 'react-router-dom'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import NotFound from './components/NotFound';



export const userContext=React.createContext();

function App() {
  const[user,setUser]=useState(undefined);
  const navigate=useNavigate()
  const[navbarHidden,setNavBarHidden]=useState(true)
  useEffect(()=>{
    const currentUser=JSON.parse(localStorage.getItem('user'));
    if(currentUser){
      setUser(currentUser)
      setNavBarHidden(false);
      navigate('home')
    }
    else{
      navigate('/')
    }
  },[])

  const loggedInUser=(user)=>{
    setUser(user);
    setNavBarHidden(false);
  }

  return (
    <userContext.Provider value={user}>
      {navbarHidden?null:<Navbar/>}
      <Routes>
        <Route path='/' element={<Login loggedInUser={loggedInUser}/>}></Route>
        <Route path='home' element={<HomePage/>}></Route>
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </userContext.Provider>
    // <div className="App">
    //   <Login/>
    // </div>
  );
}

export default App;
