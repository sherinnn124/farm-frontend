import React, { useState } from 'react'
import styles from './styles.module.css'
import {FaCircle} from "react-icons/fa";
function Answer({questionData,survey,progress}) {
  const {question,answerType,answers,required,labeling,color}=questionData.question;
  const {questionIndex}=questionData;

  const doProgress=(e,value)=>{
    console.log(e.target.checked);
    let indicator=[...progress.progressIndicator];
      if(!progress.progressIndicator[questionIndex]){
        indicator[questionIndex]=true;
        progress.setProgressIndicator(indicator);
        progress.setCurrentProgress(previous=>previous+1);
      }
      if(value==='' || (answerType=="checkbox" && !e.target.checked && !survey.surveyResult[questionIndex].answer.length)){
      indicator[questionIndex]=false;
      progress.setProgressIndicator(indicator);
      progress.setCurrentProgress(previous=>previous-1);
      }
  }

  const handleChange=(e)=>{
    const value=e.target.value;
    console.log(value)
    let array=[...survey.surveyResult];
    if(answerType==='checkbox'){
      if(e.target.checked){
      array[questionIndex].answer.push(value);
      survey.setSurveyResult(array);
      }
      else{
        array[questionIndex].answer=array[questionIndex].answer.filter((answer)=>answer!==value);
        survey.setSurveyResult(array);
      }
    }
    else{
    array[questionIndex].answer[0]=value;
    survey.setSurveyResult(array);
    }
    //progressBar logic
    if(labeling&&required){
      if(survey.surveyResult[questionIndex].answer.length && survey.surveyResult[questionIndex].labels.some((label)=>label.length>0)){
        doProgress(e,value);
      }
    }
    if(required && !labeling){
      if(survey.surveyResult[questionIndex].answer.length || answerType==="checkbox"){
        doProgress(e,value)
      }
    }
  }
  return (
      <div className={styles.questionContainer}>
        {labeling && <div style={{color:`#${color}`}}><FaCircle/></div>}
        <h3 className={styles.question}>{required && <span style={{color:'red'}}>*</span>} {question}</h3>
        <div className={styles.answerContainer}>
          {answerType!=="text"&&
              answers.map((answer,i)=>{
                return(
                  <div className={styles.multipleChoices} key={i}>
                  {answerType=='radio'&&
                    <input type={answerType} name={"answer"} value={answer} onChange={handleChange} checked={answer===survey.surveyResult[questionIndex].answer[0]}/>
                  }
                  {answerType=='checkbox'&&
                    <input type={answerType} name={"answer"} value={answer} onChange={handleChange} checked={survey.surveyResult[questionIndex].answer.some((ans)=>ans===answer)}/>
                  }
                  
                  <label htmlFor="answer" className={styles.label} >{answer}</label>
                  </div>
                )
              })
          }
          {
            answerType=="text"&&
            <div>
              <input type="text" name="answer" className={styles.textInput} value={survey.surveyResult[questionIndex].answer} onChange={handleChange}/>
            </div>
          }
        </div>
      </div>
  )
}

export default Answer
