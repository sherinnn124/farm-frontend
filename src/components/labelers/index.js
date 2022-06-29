import React, { useEffect } from 'react'
import { FaEdit,FaTrash} from "react-icons/fa";
import { useNavigate} from 'react-router-dom';
import { useState } from 'react'
import styles from './styles.module.css'
import { IoCheckmarkDone } from "react-icons/io5";
import { MdEmail,MdClose,MdLabelOutline} from "react-icons/md";
import {GrUserAdmin} from 'react-icons/gr'
import Select from 'react-select'
import validator from 'validator'
import axios from 'axios';
import {customStyles,customTheme} from '../../services/service'
import Loader from '../shared/Loader';



function Labelers() {
    const[usersData,setUsersData]=useState([]);
    const [isLabelerModalOpen,setIsLabelerModalOpen]=useState(false);
    const [newLabeler,setNewLabeler]=useState({email:'',usrRoleId:''});
    const [isSubmitted,setIsSubmitted]=useState(false);
    const navigate=useNavigate();
    const [formErrors,setFormErrors]=useState({});
    const [showAlert,setShowAlert]=useState(false);
    const [selectedRole,setSelectedRole]=useState(null)
    const [loading,setIsLoading]=useState(true);
    
    const options=[
        {
            value:1,
            label:(
                <div>
                    <GrUserAdmin/> Admin
                </div>
            )
        },
        {
            value:2,
            label:(
                <div>
                    <MdLabelOutline/> Labeler
                </div>
            )
        }
    ]

    useEffect(()=>{
        axios.get('user')
        .then(response=>{
            setUsersData(response.data.items);
            setIsLoading(false)
        })
        .catch(error=>console.log(error))
    },[])
    const handleChange=(e)=>{
        const {value,name}=e.target;
        setNewLabeler({...newLabeler,[name]:value});
    }
    const handleSelectRole=(event)=>{
        setSelectedRole(event);
        setNewLabeler({...newLabeler,usrRoleId:event.value});
        console.log(newLabeler)
        console.log(event.value)
    }
    useEffect(()=>{
        if(isSubmitted&&Object.keys(formErrors).length==0){
            axios.post('user/inviteUserWithRole',newLabeler)
            .then(response=>{
                setShowAlert(true);
                setIsSubmitted(false);
                setNewLabeler({email:'',usrRoleId:''});
                setSelectedRole(null)
            })
            .catch(error=>{
                console.log(error);
                setIsSubmitted(false)
            })
        }
        else{
            setIsSubmitted(false)
        }
        }
    ,[formErrors])

    const validate=()=>{
        const errors={};
        if(!validator.isEmail(newLabeler.email)){errors.email='A valid email is required'}
        if(newLabeler.usrRoleId==''){errors.role="Select user role"}
        setIsSubmitted(true);
        setFormErrors(errors);
        
    }
    const removelabeler=(id)=>{
    setUsersData((previouslabelers)=>previouslabelers.filter((labeler)=>labeler.id!=id));

      // delete route
    }
    useEffect(()=>{
        if(showAlert){
        const timeOut=setTimeout(() => {
            setShowAlert(false)
        },3000);
        return ()=>clearInterval(timeOut)
    }
    },[showAlert])
    return (
    <>
    {loading?<Loader/>:
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
            {usersData.length==0?
            <tr><td colSpan="7">No labelers Yet</td></tr>:
                usersData.map((userData)=>{
                    return(
                    <tr key={userData.id}>
                        <td>{userData.id}</td>
                        <td>{userData.name}</td>
                        <td>{userData.email}</td>
                        <td>{userData.mobile}</td>
                        <td>{userData.labels}</td>
                        <td>{userData.updated}</td>
                        <td style={{display:"flex"}}>
                            <button className='edit action' style={{fontSize:'1rem'}} onClick={()=>navigate(`edit/${userData.id}`,{state:{userData:userData}})}><FaEdit/></button>
                            <button className='remove action' style={{fontSize:'1rem'}} onClick={()=>removelabeler(userData.id)}><FaTrash/></button>
                        </td>
                    </tr>
                    )
                })   
            }
            </tbody>
        </table>
    </div>
    }
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
                    <div>
                        <Select isSearchable={false} styles={customStyles} theme={customTheme} options={options} placeholder={"Select Role..."} value={selectedRole} onChange={handleSelectRole}></Select>
                        {formErrors.role&&<p style={{color:'var(--danger)',textAlign:'center',marginTop:'0.5rem'}}>{formErrors.role}</p>}
                    </div>
                </div>
                <button className='btn' style={{display:'block',margin:'0 auto',fontSize:'1rem'}} type='button' onClick={validate}>Invite</button>
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
