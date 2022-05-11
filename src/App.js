import React, { useEffect } from 'react';
import './App.css';
import Login from './components/login';
import HomePage from './components/HomePage'
import {Route,Routes} from 'react-router-dom'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export const userContext=React.createContext();

function App() {
  const[user,setUser]=useState(undefined);
  const navigate=useNavigate()
  useEffect(()=>{
    const currentUser=JSON.parse(localStorage.getItem('user'));
    if(currentUser){
      setUser(currentUser)
      navigate('home')
    }
    else{
      navigate('/')
    }
  },[])

  const loggedInUser=(user)=>{
    setUser(user)
  }

  return (
    <userContext.Provider value={user}>
      <Routes>
        <Route path='/' element={<Login loggedInUser={loggedInUser}/>}></Route>
        <Route path='home' element={<HomePage/>}></Route>
      </Routes>
    </userContext.Provider>
    // <div className="App">
    //   <Login/>
    // </div>
  );
}

export default App;
