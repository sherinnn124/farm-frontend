import React, { useState } from 'react'
import styles from './styles.module.css'
import {FaCircle} from "react-icons/fa";
import {useContext} from 'react'
import { questionTypesContext } from '../../../App';
function Answer({questionData,survey,progress}) {
  const {text,questionTypeId,options,mandatoryFlg}=questionData.question;
  const {questionIndex}=questionData;
  const questionTypes=useContext(questionTypesContext);
  console.log(questionTypes);
  // const doProgress=(e,value)=>{
  //   console.log(e.target.checked);
  //   let indicator=[...progress.progressIndicator];
  //     if(!progress.progressIndicator[questionIndex]){
  //       indicator[questionIndex]=true;
  //       progress.setProgressIndicator(indicator);
  //       progress.setCurrentProgress(previous=>previous+1);
  //     }
  //     if(value==='' || (answerType=="checkbox" && !e.target.checked && !survey.surveyResult[questionIndex].answer.length)){
  //     indicator[questionIndex]=false;
  //     progress.setProgressIndicator(indicator);
  //     progress.setCurrentProgress(previous=>previous-1);
  //     }
  // }

  const handleChange=(e,optionIndex)=>{
    const value=e.target.value;
    console.log(value)
    let array=[...survey.surveyResult];
    const arrayTwo=[...survey.chosenOptions]
    if(questionTypes[questionTypeId]==='checkbox'){
      if(e.target.checked){
        array[questionIndex].answerOptionId.push(value);
        survey.setSurveyResult(array);
        arrayTwo[questionIndex].answers.push(options[optionIndex]);
        survey.setChosenOptions(arrayTwo)
      }
      else{
        array[questionIndex].answerOptionId=array[questionIndex].answerOptionId.filter((answer)=>answer!==value);
        survey.setSurveyResult(array);
        arrayTwo[questionIndex].answers.filter((answer)=>answer.id != value);
        survey.setChosenOptions(arrayTwo);
      }
    }
    else if(questionTypes[questionTypeId]=="radio"){
    array[questionIndex].answerOptionId[0]=parseInt(value);
    survey.setSurveyResult(array);
    arrayTwo[questionIndex].answers=options[optionIndex];
    survey.setChosenOptions(arrayTwo);
    }
    else if(questionTypes[questionTypeId]=="text") {
      arrayTwo[questionIndex].answers=questionData.question;
      survey.setChosenOptions(arrayTwo);
    }
    //progressBar logic
    // if(labeling&&required){
    //   if(survey.surveyResult[questionIndex].answer.length && survey.surveyResult[questionIndex].labels.some((label)=>label.length>0)){
    //     doProgress(e,value);
    //   }
    // }
    // if(required && !labeling){
    //   if(survey.surveyResult[questionIndex].answer.length || answerType==="checkbox"){
    //     doProgress(e,value)
    //   }
    // }
  }
  return (
    <>
      {questionTypes&&
        <div className={styles.questionContainer}>
        {/* {labeling && <div style={{color:`#${color}`}}><FaCircle/></div>} */}
        <h3 className={styles.question}>{mandatoryFlg && <span style={{color:'red'}}>*</span>} {text}</h3>
        <div className={styles.answerContainer}>
          {questionTypes[questionTypeId]!=="text"&&
              options.map((option,i)=>{
                return(
                  <div className={styles.multipleChoices} key={i}>
                  {questionTypes[questionTypeId]=='radio'&&
                    <input type="radio" name={"answerOptionId"} value={option.id} onChange={(e)=>handleChange(e,i)} checked={option.id==survey.surveyResult[questionIndex].answerOptionId[0]}/>
                  }
                  {questionTypes[questionTypeId]=='checkbox'&&
                    <input type="checkbox" name={"answerOptionId"} value={option.id} onChange={handleChange} checked={survey.surveyResult[questionIndex].answerOptionId.some((ans)=>ans==option.id)}/>
                  }
                  
                  <label htmlFor="answerOptionId" className={styles.label} >{option.requireLabelingFlg && <span style={{color:`#${option.optionColor}`}}>*</span>} {option.optionText}</label>
                  </div>
                )
              })
          }
          {
            questionTypes[questionTypeId]=="text"&&
            <div>
              <input type="text" name="answerOptionId" className={styles.textInput} value={survey.surveyResult[questionIndex].answerOptionId} onChange={handleChange}/>
            </div>
          }
        </div>
      </div>
      }
    </>
  )
}

export default Answer
