import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
const root = ReactDOM.createRoot(document.getElementById('root'));


axios.defaults.baseURL='http://34.66.190.29:8080/imagetool-be/';
// axios.interceptors.request.use(request=>{
//   if(localStorage.getItem('token')){
//     axios.defaults.headers.common['Authorization']='Bearer ' + localStorage.getItem('token');
//   }
//   return request
// })
// axios.interceptors.response.use(response=>{
//   if(localStorage.getItem('token')){
//     axios.defaults.headers.common['Authorization']='Bearer ' + localStorage.getItem('token');
//   }
//   return response
// })
if(localStorage.getItem('token')){
axios.defaults.headers.common['Authorization']='Bearer ' + localStorage.getItem('token');}


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
