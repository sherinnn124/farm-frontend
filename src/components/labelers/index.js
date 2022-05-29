import React, { useEffect } from 'react'
import { FaEdit,FaTrash} from "react-icons/fa";
import { useNavigate} from 'react-router-dom';
import { useState } from 'react'
import data from './data'
import styles from './styles.module.css'
import { IoCheckmarkDone } from "react-icons/io5";
import { MdEmail,MdClose} from "react-icons/md";
import {updated} from '../../services/service'
import validator from 'validator'
import axios from 'axios';




function Labelers() {
//   const[labelersData,setlabelersData]=useState([]);
    const[labelersData,setlabelersData]=useState(data);
    const [isLabelerModalOpen,setIsLabelerModalOpen]=useState(false);
    const [newLabeler,setNewLabeler]=useState({email:'',updated:''});
    const [isSubmitted,setIsSubmitted]=useState(false);
    const navigate=useNavigate();
    const [formErrors,setFormErrors]=useState({})
    const  [showAlert,setShowAlert]=useState(false)

    const handleChange=(e)=>{
        const {value,name}=e.target;
        setNewLabeler({...newLabeler,[name]:value});
    }
    const SubmitLabeler=()=>{
        const updatedd=updated();
        setNewLabeler({...newLabeler,updated:updatedd})
        setFormErrors(validate(newLabeler));
        setIsSubmitted(true);
        // if(isSubmitted&&Object.keys(formErrors).length==0){
        //     setNewLabeler({updated:'',email:''});
        //     setShowAlert(true);
        //     axios.post('',newLabeler)
        //     .then(res=>{
        //         setIsLabelerModalOpen(false);
        //         setIsSubmitted(false);
        //         setNewLabeler({name:'',email:'',mobileNumber:'',updated:''});
        //     })
        //     .catch(error=>console.log(error))
        //}
    }
    useEffect(()=>{
        if(isSubmitted&&Object.keys(formErrors).length==0){
            setNewLabeler({updated:'',email:''});
            setShowAlert(true);
        }
        setIsSubmitted(false);
    },[isSubmitted])
    const validate=(newLabeler)=>{
        const errors={};
        // if(!newLabeler.name)errors.name='Name is required'
        if(!validator.isEmail(newLabeler.email))errors.email='A valid email is required'
        // if(!newLabeler.mobileNumber)errors.mobileNumber='Number is required'

        return errors
    }
    const removelabeler=(id)=>{
    setlabelersData((previouslabelers)=>previouslabelers.filter((labeler)=>labeler.id!=id));

      // delete route
    }
    useEffect(()=>{
        const timeOut=setTimeout(() => {
            setShowAlert(false)
        },3000);
        return ()=>clearInterval(timeOut)
    },[showAlert])
    return (
    <>
    <div className='container'>
        <div className='btnContainer'>
            <button className='btn' style={{marginTop:'2rem'}} onClick={()=>setIsLabelerModalOpen(true)}>+New labeler</button>
        </div>
        <table >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Labels</th>
                    <th>Updated</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {labelersData.length==0?
            <tr><td colSpan="7">No labelers Yet</td></tr>:
                labelersData.map((labeler)=>{
                    return(
                    <tr key={labeler.id}>
                        <td>{labeler.id}</td>
                        <td>{labeler.name}</td>
                        <td>{labeler.email}</td>
                        <td>{labeler.phone}</td>
                        <td>{labeler.labels}</td>
                        <td>{labeler.updated}</td>
                        <td style={{display:"flex"}}>
                            <button className='edit action' style={{fontSize:'1rem'}} onClick={()=>navigate(`edit/${labeler.id}`,{state:{labeler:labeler}})}><FaEdit/></button>
                            <button className='remove action' style={{fontSize:'1rem'}} onClick={()=>removelabeler(labeler.id)}><FaTrash/></button>
                        </td>
                    </tr>
                    )
                })   
            }
            </tbody>
        </table>
    </div>
    <div className={isLabelerModalOpen?`${styles.modalOverlay} ${styles.showModal}`:`${styles.modalOverlay}`} >
            <div className={styles.modalContainer}>
                <button  className={styles.closeModal} style={{fontWeight:'bold'}} onClick={()=>setIsLabelerModalOpen(false)}>
                    <MdClose />
                </button>
                <h2 className={styles.newLabeler}>New Labeler</h2>
                <div className={styles.inputsContainer}>
                    <div>
                        <div>
                            <MdEmail style={{fontSize:'2rem',color:'var(--main-color)'}}/>
                            <input type="email" name="email" placeholder='Labeler Email' value={newLabeler.email} onChange={handleChange}/>
                        </div>
                        {formErrors.email&&<p style={{color:'var(--danger)',textAlign:'center',marginTop:'0.5rem'}}>{formErrors.email}</p>}
                    </div>
                </div>
                <button className='btn' style={{display:'block',margin:'0 auto',fontSize:'1rem'}} type='button' onClick={SubmitLabeler}>Invite</button>
            </div>
    </div>
    {showAlert&&
    <div style={{position:'fixed',bottom:'3rem',left:'50%',transform:'translateX(-50%)',backgroundColor:'#d4edda',padding:'0.5rem 1rem',borderRadius:'0.5rem',zIndex:'4'}}>
        <p>Invitation sent <IoCheckmarkDone/></p>
    </div>
    }
    </>
    )
}

export default Labelers
