import React, { useEffect } from 'react';
import './App.css';
import Login from './components/login';
import HomePage from './components/HomePage'
import {Route,Routes} from 'react-router-dom'
import { useState } from 'react';
import { useNavigate,useLocation,Navigate } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import NotFound from './components/NotFound';
import LabelingTasks from './components/LabelingTasks'
import NewTask from './components/LabelingTasks/NewTask';
// import EditFarm from './components/Farms/EditFarm';
import Surveys from './components/Surveys'
import Labelers from './components/labelers';
import NewSurvey from './components/Surveys/AddEditSurvey';
import AnswerLabelSurvey from './components/AnswerLabelSurvey';





export const userContext=React.createContext();
export const navbarContext=React.createContext();
function App() {
  const[user,setUser]=useState(undefined);
  const navigate=useNavigate();
  const[navbarHidden,setNavbarHidden]=useState(true);
  const location = useLocation();

  useEffect(()=>{
    const currentUser=JSON.parse(localStorage.getItem('user'));
    if(currentUser){
      setUser(currentUser)
      setNavbarHidden(false);
      console.log(location.pathname)
      if(location.pathname === '/login'){
        navigate("/",{replace:true})
      }
      else{
        navigate(location.pathname,{replace:true})
      }
    }
    else{
      navigate('login',{state:{path:location.pathname}})
    }
  },[])

  const loggedInUser=(user)=>{
    setUser(user);
    setNavbarHidden(false);
  }

  return (
    <userContext.Provider value={user}>
        <navbarContext.Provider value={{navbarHidden,setNavbarHidden}}>
          {navbarHidden?null:<Navbar />}
          <Routes>
            <Route path='login' element={!user?<Login loggedInUser={loggedInUser}/>:<Navigate to="/"/>}></Route>
            <Route path='*' element={<NotFound navbar={{navbarHidden,setNavbarHidden}}/>}></Route>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='labelingTasks' element={<LabelingTasks/>}></Route>
            <Route path='labelingTasks/newTask' element={<NewTask/>}></Route>
            {/* <Route path='farms/edit/:id' element={<EditFarm/>}></Route> */}
            <Route path='surveys' element={<Surveys/>}></Route>
            <Route path='surveys/newSurvey' element={<NewSurvey/>}></Route>
            <Route path='labelers' element={<Labelers/>}></Route>
            <Route path='surveys/edit/:id' element={<NewSurvey/>}></Route>
            <Route path='AnswerLabelSurvey/:id' element={<AnswerLabelSurvey/>}></Route>
          </Routes>
        </navbarContext.Provider>
    </userContext.Provider>
  );
}

export default App;
