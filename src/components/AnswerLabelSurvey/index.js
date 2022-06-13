import React, { useEffect, useState } from 'react'
import {LabelTwo} from './LabelTwo'
import Answer from './Answer'
import styles from './styles.module.css'
import data from './data'
import {MdOutlineNavigateNext,MdOutlineNavigateBefore} from 'react-icons/md'
import axios from 'axios'
function AnswerLabelSurvey() {
  const [survey,setSurvey]=useState(data);
  const[questionIndex,setQuestionIndex]=useState(0);
  const {questions,treeId}=survey;
  const [color,setColor]=useState(questions[0].color);
  const [surveyResult,setSurveyResult]=useState(questions.map((questionData)=>({question:questionData.question,answer:'',labels:[]})));
  const [treeImages,setTreeImages]=useState(["/Hallstatt.jpg","/treeOne.jpg"]);
  const [imageIndex,setImageIndex]=useState(0);

  const changeIndex=(index)=>{
  var newIndex=index;
  if(index>questions.length-1){newIndex=0}
  if(index<0){newIndex=questions.length-1}
  setColor(questions[newIndex].color)
  const progressBar=document.getElementsByClassName('styles_progressBar__3w3FG')[0];
  progressBar.style.setProperty('--progressWidth',(newIndex+1)/questions.length);
  return newIndex
  }
  const changeImageIndex=(index)=>{
    var newIndex=index;
  if(index>treeImages.length-1){newIndex=0}
  if(index<0){newIndex=treeImages.length-1}
  return newIndex
  }
  useEffect(()=>{
    const progressBar=document.getElementsByClassName('styles_progressBar__3w3FG')[0];
    progressBar.style.setProperty('--progressWidth',(questionIndex+1)/questions.length);
  },[])
  // useEffect(()=>{
  //   axios.get('videoImage/getImage/0/3')
  //   .then(response=>console.log(response))
  //   .catch(error=>console.log(error))
  // })
  return (
    <div className={`container ${styles.container}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tree-{treeId}</th>
            <th>
              <div className={styles.progressSubmitContainer}>
                <div className={styles.progressBar}></div>
                <button className='btn'>Submit</button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{backgroundColor:"var(--background-color)"}}>
            <td className={styles.answerTd}>
              <Answer questionData={{question:questions[questionIndex],questionIndex}} survey={{surveyResult,setSurveyResult}}/>
              <div>
                <button onClick={()=>setQuestionIndex(changeIndex(questionIndex-1))} className={styles.nav}><MdOutlineNavigateBefore/></button>
                <button onClick={()=>setQuestionIndex(changeIndex(questionIndex+1))} className={styles.nav}><MdOutlineNavigateNext/></button>
              </div>
            </td>
            <td className={styles.labelTd}>
                <button className={`${styles.nav} ${styles.previous}`} onClick={()=>setImageIndex(changeImageIndex(imageIndex-1))}><MdOutlineNavigateBefore/></button>
                <button className={`${styles.nav} ${styles.next}`} onClick={()=>setImageIndex(changeImageIndex(imageIndex-1))}><MdOutlineNavigateNext/></button>
                <LabelTwo survey={{surveyResult,setSurveyResult}} color={color} questionsNumber={questions.length} questionIndex={questionIndex} imageData={{image:treeImages[imageIndex],imageIndex:imageIndex}}/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default AnswerLabelSurvey
