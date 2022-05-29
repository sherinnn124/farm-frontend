import axios from 'axios';
import React, { useEffect ,useState} from 'react'
import { useParams } from 'react-router-dom';
import data from '../data'
import styles from '../NewSurvey/styles.module.css'
import Question from './Question';
import { useNavigate,useLocation } from 'react-router-dom';
function EditSurvey() {
    // const [survey,setSurvey]=useState(null);
    const [survey,setSurvey]=useState(data[0]);
    const {id}=useParams();
    const location = useLocation()
    useEffect(()=>{
        console.log(location.pathname);
        if(location.pathname=="/surveys/edit/"+`${id}`){
            console.log("hello in edit screen")
        }
        // console.log(id)
        // axios.get(`/${id}`)
        // .then(res=>setSurvey(res))
        // .catch(error=>console.log(error))
    },[])
    const handleChange=(e)=>{
        const{name,value}=e.target;
        setSurvey({...survey,[name]:value})
    }
    const setHeight=(fieldId)=>{
        document.getElementById(fieldId).style.height = "";
        document.getElementById(fieldId).style.height = document.getElementById(fieldId).scrollHeight+'px';
    }
    const setSurveyChange=(name,value,questionIndex,optionIndex)=>{
        const surveyData={...survey};
        if(name!='possibleAnswer'){
        surveyData.questions[questionIndex][name]=value;
        }
        else{
            surveyData.questions[questionIndex].answers[optionIndex]=value;
        }
        setSurvey(surveyData);
    }
  return (
    <div style={{marginBottom:'3rem'}}>
        <div className={`${styles.surveyInfo} ${styles.container}`}>
            <input type="text" onChange={handleChange} value={survey.surveyTitle} name="surveyTitle" style={{fontSize:'2rem'}}/>
            <textarea placeholder="survey description" name="surveyDescription" value={survey.surveyDescription} onChange={handleChange} id="surveyDescription"   onKeyUp={()=>setHeight('surveyDescription')} onKeyDown={()=>setHeight('surveyDescription')}></textarea>
        </div>
        {
                survey.questions.map((question,index)=>{
                    return(
                        <Question key={index} survey={{survey,setSurvey}} questionn={{question,index}} setSurveyChange={setSurveyChange}/>
                    )
                })
            }
    </div>
  )
}

export default EditSurvey
