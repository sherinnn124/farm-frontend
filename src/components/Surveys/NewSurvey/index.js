import React,{useState} from 'react'
import Question from './Question'
import styles from './styles.module.css'
import { IoArrowDown,IoSend } from "react-icons/io5";

function NewSurvey() {
    const[questionsNumber,setQuestionsNumber]=useState(1);
    const[survey,setSurvey]=useState({surveyTitle:'Untitled survey',surveyDescription:'',questions:[{question:'Untitled Question',answers:[],answerType:'text',required:false,labeling:false}]})
    const handleChange=(e)=>{
        const{name,value}=e.target;
        setSurvey({...survey,[name]:value})
    }
    const setHeight=(fieldId)=>{
        document.getElementById(fieldId).style.height = "";
        document.getElementById(fieldId).style.height = document.getElementById(fieldId).scrollHeight+'px';
    }
    const newQuestion=()=>{
        setQuestionsNumber(prev=>prev+1);
        setSurvey({...survey,questions:[...survey.questions,{question:'Untitled Question',answers:[],answerType:'text',required:false,labeling:false}]})
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
    const sendSurvey=()=>{

    }
  return (
    <div style={{marginBottom:'3rem'}}>
        <div className={`${styles.surveyInfo} ${styles.container}`}>
            <input type="text" onChange={handleChange} value={survey.surveyTitle} name="surveyTitle" style={{fontSize:'2rem'}}/>
            <textarea placeholder="survey description" name="surveyDescription" onChange={handleChange} id="surveyDescription"   onKeyUp={()=>setHeight('surveyDescription')} onKeyDown={()=>setHeight('surveyDescription')}></textarea>
        </div>
            {
                [...Array(questionsNumber)].map((question,index)=>{
                    return(
                        <Question key={index} survey={{survey,setSurvey}} questionIndex={index} setSurveyChange={setSurveyChange}/>
                    )
                })
            }
            <div style={{textAlign:'center'}}>
                <button className='btn' style={{marginRight:'1rem'}} onClick={newQuestion}><IoArrowDown/> Add question</button>
                <button className='btn'  onClick={sendSurvey}><IoSend/> Send survey</button>
            </div>
    </div>
  )
}

export default NewSurvey
