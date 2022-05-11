import React, { useEffect, useState } from 'react'
import validator from 'validator'
import styles from './styles.module.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

function Login({loggedInUser}) {
    const initialValues = {password: "",username:'' };
    const[user,setUser]=useState(initialValues)
    const[formErrors,setFormErrors]=useState({})
    const[isSubmitted,setIsSubmitted]=useState(false)
    const navigate=useNavigate()
    const[warning,setWarning]=useState('');



useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitted) {
    axios.post('token/generate-token',user)
    .then(res=>{
        setWarning('')
        localStorage.setItem('token',res.data.items.token);
        localStorage.setItem('user',JSON.stringify(res.data.items));
        loggedInUser(res.data.items);
        navigate('home')
        window.location.reload();
    })
    .catch(e=>{
        setWarning('incorrect username or password')
    })
    }
}, [formErrors]);

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setUser({...user,[name]:value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        setFormErrors(validate(user));
        setIsSubmitted(true);
    }

    const validate=(user)=>{
        const error={};
        if(!user.username){error.username="Username is required"}
        if(!user.password){error.password="password is required"}
        

        return error
        
        }
  return(
<div className={styles.formContainer}>
        <form  onSubmit={handleSubmit} className={styles.form}>
        <h2>login</h2>
        {warning&&<p className={styles.danger}>{warning}</p>}
            <div className={styles.inputContainer}>
                <label htmlFor="Username">Enter your Username:</label>
                <input name="username" onChange={handleChange} value={user.username} placeholder="your Username" className={styles.input}/>
                {formErrors.username&&<p className={styles.danger}>{formErrors.username}</p>}
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="password">Enter your Password:</label>
                <input type="password" name='password'  onChange={handleChange} value={user.password} placeholder="your password" className={styles.input}/>
                {formErrors.password&&<p className={styles.danger}>{formErrors.password}</p>}
            </div>
            <button className={styles.btn}>Submit</button>
        </form>
    </div>
  
)
  }
export default Login
