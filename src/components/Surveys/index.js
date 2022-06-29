import React, { useEffect} from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaEdit,FaTrash} from "react-icons/fa";
import data from './data'
import Loader from '../shared/Loader';
function Surveys() {
    //data should come from backend
    const[surveysData,setSurveysData]=useState([]);
    const [loading,setIsLoading]=useState(true);
    const [removedSurveyID,setRemovedSurveyId]=useState(null);
    const navigate=useNavigate();
    
    


    const removeSurvey=(id)=>{
        setSurveysData((previousSurveys)=>previousSurveys.filter((survey)=>survey.id!=id));

        // delete route
    }

    useEffect(()=>{
        axios.get('survey')
        .then(response=>{
            setSurveysData(response.data.items);
            setIsLoading(false)
        })
        .catch(e=>console.log(e))
    },[])

    useEffect(()=>{
        if(removedSurveyID){
            axios.delete(`survey/${removedSurveyID}`)
            .then((response)=>{
                console.log(response)
                setRemovedSurveyId(null)
            })
            .catch(error=>console.log(error))
        }
    },[removedSurveyID])

  return (
    <>
    {loading?<Loader/>:
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
                        <td>{survey.treeTypeDesc}</td>
                        <td>{survey.updated}</td>
                        <td style={{display:"flex"}}>
                            <button className='edit action' style={{fontSize:'1rem'}} onClick={()=>navigate(`edit/${survey.id}`,{state:{survey:survey}})}><FaEdit/></button>
                            <button className='remove action'style={{fontSize:'1rem'}} onClick={()=>setRemovedSurveyId(survey.id)}><FaTrash/></button>
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

export default Surveys
