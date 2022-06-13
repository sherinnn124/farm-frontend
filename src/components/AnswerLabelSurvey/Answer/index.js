import React, { useState } from 'react'
import styles from './styles.module.css'

function Answer({questionData,survey}) {
  const {question,answerType,answers}=questionData.question;
  const {questionIndex}=questionData;
  const handleChange=(e)=>{
    const value=e.target.value;
    const array=[...survey.surveyResult];
    array[questionIndex].answer=value;
    survey.setSurveyResult(array);
  }
  return (
      <div className={styles.questionContainer}>
        <h3 className={styles.question}>{question}</h3>
        <div className={styles.answerContainer}>
          {answerType!=="text"&&
              answers.map((answer,i)=>{
                return(
                  <div className={styles.multipleChoices} key={i}>
                  <input type={answerType} name="answer" value={answer} onChange={handleChange} checked={answer===survey.surveyResult[questionIndex].answer}/>
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
