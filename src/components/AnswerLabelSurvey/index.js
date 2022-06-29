import React, { useEffect, useState } from 'react'
import {LabelTwo} from './LabelTwo'
import Answer from './Answer'
import styles from './styles.module.css'
import data from './data'
import {MdOutlineNavigateNext,MdOutlineNavigateBefore} from 'react-icons/md'
import axios from 'axios'
import {generateColor} from '../../services/service'
import Loader from '../shared/Loader'
function AnswerLabelSurvey() {
  // const [survey,setSurvey]=useState(data);
  const [survey,setSurvey]=useState(null);
  const[questionIndex,setQuestionIndex]=useState(0);
  // const {questions,treeId}=survey;
  const [questions,setQuestions]=useState(null)
  // const [color,setColor]=useState(questions[0].color);
  const [color,setColor]=useState(null);
  // const [surveyResult,setSurveyResult]=useState(questions.map((questionData)=>({question:questionData.question,answer:[],labels:[]})));
  const [surveyResult,setSurveyResult]=useState(null);
  // const [treeImages,setTreeImages]=useState(["/Hallstatt.jpg","/treeOne.jpg"]);
  const [treeImages,setTreeImages]=useState(null);
  // const [treeImages,setTreeImages]=useState(null);
  // const [errors,setErrors]=useState(questions.map((question)=>({})));
  const [totalProgressNumber,setTotalProgressNumber]=useState(0);
  const [currentProgress,setCurrentProgress]=useState(0);
  // const [progressIndicator,setProgressIndicator]=useState(questions.map((question)=>false));
  const [progressIndicator,setProgressIndicator]=useState(null);
  const [imageIndex,setImageIndex]=useState(0);
  // const [savedAnnotations,setSavedAnnotations]=useState([treeImages.map((tree)=>[])]);
  const [savedAnnotations,setSavedAnnotations]=useState(null);
  const [alert,setAlert]=useState({message:'',type:'',show:false});
  const [isSubmitted,setIsSubmitted]=useState(false);
  const [loading,setIsLoading]=useState(true);
  useEffect(()=>{
    axios.get('treeAnalysis')
    .then(response=>{
      const tree=response.data.items[0].treeAnalysisDtls.filter((tree)=>tree.treeRef== "farm0.mango_seedlings.1");
      setTreeImages(tree.map((image)=>`http://34.66.190.29:8080/imagetool-be/videoImage/getImage/1/${image.treeRef}/${image.imageName}`));
    })
    .then(res=>{
      axios.get('survey')
      .then(response=>{
        const data=response.data.items[0];
        console.log(data)
        data.questions.forEach((question)=>{
          question.color=generateColor();
        })
        setSurvey(data);
        setIsLoading(false)
      })
    }
    )
  },[])

  useEffect(()=>{
    if(treeImages){
    setSavedAnnotations([treeImages.map((tree)=>[])]);
    }
  },[treeImages])

  useEffect(()=>{
    if(survey){
      setQuestions(survey.questions);
    }
  },[survey])
  useEffect(()=>{
    if(questions){
      setSurveyResult(questions.map((questionData)=>({question:questionData.question,answer:[],labels:[]})));
      setProgressIndicator(questions.map((question)=>false));
      setColor(questions[0].color)
    }
  },[questions])


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
    loading?<Loader/>:
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
              survey={{surveyResult,setSurveyResult}}
              progress={{currentProgress,setCurrentProgress,progressIndicator,setProgressIndicator}}/>
              <div>
                <button onClick={()=>setQuestionIndex(changeIndex(questionIndex-1))} className={styles.nav}><MdOutlineNavigateBefore/></button>
                <button onClick={()=>setQuestionIndex(changeIndex(questionIndex+1))} className={styles.nav}><MdOutlineNavigateNext/></button>
              </div>
            </td>
            <td className={styles.labelTd}>
                <button className={`${styles.nav} ${styles.previous}`} onClick={()=>setImageIndex(changeImageIndex(imageIndex-1))}><MdOutlineNavigateBefore/></button>
                <button className={`${styles.nav} ${styles.next}`} onClick={()=>setImageIndex(changeImageIndex(imageIndex+1))}><MdOutlineNavigateNext/></button>
                {treeImages&&
                  <LabelTwo survey={{surveyResult,setSurveyResult}} 
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
