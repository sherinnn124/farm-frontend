import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaEdit,FaTrash} from "react-icons/fa";
import data from './data'
function Surveys() {
    //data should come from backend
    const[surveysData,setSurveysData]=useState(data);
    const navigate=useNavigate();
    

    const newSurvey=()=>{
        let number;
        if(surveysData.length!=0){number=surveysData[surveysData.length-1].id+1;}
        else{number=1}
        const today=new Date();
        const date=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
        const survey={
            id:number,
            name:`farm${number}`,
            labelers:"",
            labels:"",
            progress:"",
            survies:"",
            updated:date
        }
        setSurveysData([...surveysData,survey])
        // posting new farm
    }

    const removeSurvey=(id)=>{
        setSurveysData((previousSurveys)=>previousSurveys.filter((survey)=>survey.id!=id));

        // delete route
    }

    //API call to fetch farm data-->
    // useEffect(()=>{
    //     axios.get()
    //     .then(res=>setFarmsData(res.data))
    //     .catch(e=>console.log(e))
    // })

  return (
    <div className='container'>
        <div className='btnContainer'>
            <button className='btn' style={{marginTop:'2rem'}} onClick={()=>navigate('newSurvey')}>+New Survey</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Tree Type</th>
                    <th>Questions Number</th>
                    <th>Updated</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {surveysData.length==0?
            <tr><td colSpan="8">No Surveys Yet</td></tr>:
                surveysData.map((survey)=>{
                    return(
                    <tr key={survey.id}>
                        <td>{survey.id}</td>
                        <td>{survey.surveyTitle}</td>
                        <td>{survey.treeType}</td>
                        <td>{survey.questions.length}</td>
                        <td>{survey.updated}</td>
                        <td style={{display:"flex"}}>
                            <button className='edit action' style={{fontSize:'1rem'}} onClick={()=>navigate(`edit/${survey.id}`,{state:{survey:survey}})}><FaEdit/></button>
                            <button className='remove action'style={{fontSize:'1rem'}} onClick={()=>removeSurvey(survey.id)}><FaTrash/></button>
                        </td>
                    </tr>
                    )
                })   
            }
            </tbody>
        </table>
    </div>
  )
}

export default Surveys
