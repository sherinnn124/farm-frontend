import React, { useEffect, useState,useContext } from 'react'
import {LabelTwo} from './LabelTwo'
import Answer from './Answer'
import styles from './styles.module.css'
import {MdOutlineNavigateNext,MdOutlineNavigateBefore} from 'react-icons/md'
import axios from 'axios'
import { questionTypesContext } from '../../App'
import {generateColor} from '../../services/service'
import Loader from '../shared/Loader'
function AnswerLabelSurvey() {
  const [survey,setSurvey]=useState(null);
  const[questionIndex,setQuestionIndex]=useState(0);
  const [questions,setQuestions]=useState(null)
  const [color,setColor]=useState(null);
  const [surveyResult,setSurveyResult]=useState(null);
  const [treeImages,setTreeImages]=useState(null);
  // const [errors,setErrors]=useState(questions.map((question)=>({})));
  const [totalProgressNumber,setTotalProgressNumber]=useState(0);
  const [currentProgress,setCurrentProgress]=useState(0);
  const [progressIndicator,setProgressIndicator]=useState(null);
  const [imageIndex,setImageIndex]=useState(0);
  const [savedAnnotations,setSavedAnnotations]=useState(null);
  const [alert,setAlert]=useState({message:'',type:'',show:false});
  const [isSubmitted,setIsSubmitted]=useState(false);
  const [chosenOptions,setChosenOptions]=useState(null);
  const questionTypes=useContext(questionTypesContext);

  useEffect(()=>{
    axios.get('treeImage/findByTreeDetectionId/1656029972/0')
    .then(response=>
      setTreeImages(
        response.data.items.map(
        (image)=>({url:`http://34.66.190.29:8080/imagetool-be/treeImage/getImageBak/${image.id}`,imageId:image.id})
        )
      )
    )
  },[])

  useEffect(()=>{
    axios.get('survey/14')
    .then(response=>setSurvey(response.data.items))
  },[])

  useEffect(()=>{
    if(treeImages){
    setSavedAnnotations([treeImages.map((tree)=>[])]);
    }
  },[treeImages])


  useEffect(()=>{
    if(survey){
      console.log(survey)
      setQuestions(survey.questions);
    }
  },[survey])
  useEffect(()=>{
    if(questions && questionTypes){
      setSurveyResult(questions.map((questionData)=>({surveyId:survey.id,questionId:questionData.id,answerOptionId:[],labels:[]})));
      setProgressIndicator(questions.map((question)=>false));
      // setColor(questions[0].color)
      setChosenOptions(
        questions.map((question)=>({questionType:questionTypes[question.questionTypeId],answers:[]}))
      )
    }
  },[questions,questionTypes])


  useEffect(()=>{
    if(questions){
    questions.forEach((question)=>{
      const {labeling,required}=question;
      if ((labeling&&required)||(labeling&&!required)|| (!labeling&&required)){
        setTotalProgressNumber(previous=>previous+1)
      }
    })
  }
  },[questions])
  const changeIndex=(index)=>{
  var newIndex=index;
  if(index>questions.length-1){newIndex=0}
  if(index<0){newIndex=questions.length-1}
  setColor(questions[newIndex].color)
  return newIndex
  }

  const changeImageIndex=(index)=>{
    var newIndex=index;
  if(index>treeImages.length-1){newIndex=0}
  if(index<0){newIndex=treeImages.length-1}
  return newIndex
  }
  useEffect(()=>{
    if(treeImages&&savedAnnotations&&survey){
    const progressBar=document.getElementsByClassName('styles_progressBar__3w3FG')[0];
    console.log(progressBar)
    progressBar.style.setProperty('--progressWidth',currentProgress/totalProgressNumber);
    }
  },[totalProgressNumber,currentProgress])
  
  const handleSubmit=()=>{
    const errors=[];
    questions.forEach((question,index)=>{
    const {labeling,required}=question;
    if(labeling && required && !(surveyResult[index].answer.length && surveyResult[index].labels.some((label)=>label.length>0))){
      errors.push('Submission failed answer or labeling required')
    }
    else if(required && (!labeling) && (!surveyResult[index].answer.length)){
      errors.push('Submission failed answer required')
    }
    else if (labeling && (!required) && (!surveyResult[index].labels.some((label)=>label.length>0))){
    errors.push('Submission failed labeling required');
    }
    })
    if(!errors.length){
      setAlert({msg:'Submitted successfully',type:'success',show:true});
      setIsSubmitted(true)
    }
    else if(errors.length){
      setAlert({msg:'Submission failed answer or labeling required',type:'failure',show:true});
    }

  }


  useEffect(()=>{
    if(isSubmitted){
      // axios.post('',surveyResult)
      console.log("success");
    }
  },[isSubmitted])


  useEffect(()=>{
    if(alert.show){
      const timeOut=setTimeout(() => {
        setAlert({msg:'',type:'',show:false})
      },2000);
      return ()=>clearInterval(timeOut)
    }
  },[alert])

   return (
    <>
    {
    !(treeImages && survey)?<Loader/>:
    <div className={`container ${styles.container}`}>
      {alert.show && 
      <div style={{position:'fixed',left:'50%',bottom:'1rem',transform:'translateX(-50%)'
      ,backgroundColor:alert.type=="success"?'#d4edda':'#f8d7da',zIndex:'1',padding:'0.5rem',borderRadius:'0.25rem'}}>
      {alert.msg}
      </div>}
      {treeImages && savedAnnotations && questions && surveyResult &&
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tree-{survey.treeType}</th>
            <th>
              <div className={styles.progressSubmitContainer}>
                <div className={styles.progressBar}></div>
                <button className='btn' onClick={handleSubmit}>Submit</button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{backgroundColor:"var(--background-color)"}}>
            <td className={styles.answerTd}>
              <Answer questionData={{question:questions[questionIndex],questionIndex}} 
              survey={{surveyResult,setSurveyResult,chosenOptions,setChosenOptions}}
              progress={{currentProgress,setCurrentProgress,progressIndicator,setProgressIndicator}} />
              <div>
                <button onClick={()=>setQuestionIndex(changeIndex(questionIndex-1))} className={styles.nav}><MdOutlineNavigateBefore/></button>
                <button onClick={()=>setQuestionIndex(changeIndex(questionIndex+1))} className={styles.nav}><MdOutlineNavigateNext/></button>
              </div>
            </td>
            <td className={styles.labelTd}>
                <button className={`${styles.nav} ${styles.previous}`} onClick={()=>setImageIndex(changeImageIndex(imageIndex-1))}><MdOutlineNavigateBefore/></button>
                <button className={`${styles.nav} ${styles.next}`} onClick={()=>setImageIndex(changeImageIndex(imageIndex+1))}><MdOutlineNavigateNext/></button>
                {treeImages&&
                  <LabelTwo survey={{surveyResult,setSurveyResult,chosenOptions}} 
                  color={color} 
                  savedAnno={{savedAnnotations,setSavedAnnotations}} 
                  progress={{currentProgress,setCurrentProgress,progressIndicator,setProgressIndicator,question:questions[questionIndex]}}
                  questionIndex={questionIndex} 
                  imageData={{image:treeImages[imageIndex],imageIndex:imageIndex}}/>
                  //treeImages[imageIndex]
                }
            </td>
          </tr>
        </tbody>
      </table>
      }
    </div>
  }
    </>
  )
}

export default AnswerLabelSurvey
