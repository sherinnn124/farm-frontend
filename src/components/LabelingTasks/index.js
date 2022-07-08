import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaEdit,FaTrash} from "react-icons/fa";
import Loader from '../shared/Loader';
function LabelingTasks() {
    //data should come from backend
    const [labelingTasks,setLabelingTasks]=useState(null);
    const [surveys,setSurveys]=useState(null);
    const [labelers,setLabelers]=useState(null);
    const navigate=useNavigate();
    

    useEffect(()=>{
        axios.get('labelingTask')
        .then(response=>setLabelingTasks(response.data.items))
    },[])


    useEffect(()=>{
        axios.get('survey')
        .then(response=>{
            const data=response.data.items;
            const obj={}
            for(let i=0;i<data.length;i++){
                obj[data[i].id]=data[i].surveyTitle
            }
            setSurveys(obj)
        })
    },[])

    useEffect(()=>{
        axios.get('user')
        .then(response=>{
            const data=response.data.items;
            const obj={}
            for(let i=0;i<data.length;i++){
                obj[data[i].id]=data[i].name
            }
            setLabelers(obj)
        })
    },[])

    const removeTask=(id)=>{
        // setFarmsData((previousFarms)=>previousFarms.filter((farm)=>farm.id!=id));
        // delete route
    }

  return (
    <>
    {!(labelingTasks && surveys && labelers)?<Loader/>:
        <div className='container'>
            <div className='btnContainer'>
                <button className='btn' onClick={()=>navigate('newTask')} style={{marginTop:'2rem'}}>+New labeling task</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Trees Number</th>
                        <th>Images Number</th>
                        <th>Survey</th>
                        <th>Labeler</th>
                        <th>progress</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {labelingTasks.length==0?
                <tr><td colSpan="8">No Farms Yet</td></tr>:
                    labelingTasks.map((task)=>{
                        return(
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.numOfTrees}</td>
                            <td>{task.numOfImages}</td>
                            <td>{surveys[task.surveyId]}</td>
                            <td>{labelers[task.labelerId]}</td>
                            <td>{task.status}</td>
                            <td style={{display:"flex"}}>
                                <button className='edit action' style={{fontSize:'1rem'}} onClick={()=>navigate(`edit/${task.id}`,{state:{task:task}})}><FaEdit/></button>
                                <button className='remove action' style={{fontSize:'1rem'}} onClick={()=>removeTask(task.id)}><FaTrash/></button>
                            </td>
                        </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    }
    </>
  )
}

export default LabelingTasks
