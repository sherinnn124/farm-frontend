import React, { useEffect, useState,useContext} from 'react'
import { useNavigate,useLocation,Navigate } from 'react-router-dom';
import {LabelTwo} from './LabelTwo'
import Answer from './Answer'
import styles from './styles.module.css'
import {MdOutlineNavigateNext,MdOutlineNavigateBefore} from 'react-icons/md'
import axios from 'axios'
import { questionTypesContext } from '../../App'
import Loader from '../shared/Loader'
function AnswerLabelSurvey() {
  const [survey,setSurvey]=useState(null);
  const [questionIndex,setQuestionIndex]=useState(0);
  const [questions,setQuestions]=useState(null)
  const [surveyResult,setSurveyResult]=useState(null);
  const [trees,setTrees]=useState(null);
  const [treeIndex,setTreeIndex]=useState(0);
  const [treeImages,setTreeImages]=useState(null);
  const [totalProgressNumber,setTotalProgressNumber]=useState(0);
  const [currentProgress,setCurrentProgress]=useState(0);
  const [progressIndicator,setProgressIndicator]=useState(null);
  const [imageIndex,setImageIndex]=useState(0);
  const [savedAnnotations,setSavedAnnotations]=useState(null);
  const [alert,setAlert]=useState({message:'',type:'',show:false});
  const [isSubmitted,setIsSubmitted]=useState(false);
  const [chosenOptions,setChosenOptions]=useState(null);
  const questionTypes=useContext(questionTypesContext);
  const [reload,setReload]=useState(true);
  const navigate=useNavigate();


  useEffect(()=>{
    //tdrunid to be replaced with labeling task id i think
    axios.get('tree/findByTreeDetectionId/1656029972')
    .then(response=>{
      const data=response.data.items;
      setTrees(data);
    })
  },[])

  useEffect(()=>{
    if(trees){
      axios.get(`treeImage/findByTreeDetectionId/1656029972/${trees[treeIndex].treeId}`)
      .then(response=>
        setTreeImages(
          response.data.items.map(
          (image)=>({url:`http://34.66.190.29:8080/imagetool-be/treeImage/getImageBak/${image.id}`,imageId:image.id})
          )
        )
      )
    }
  },[trees,treeIndex])

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
      setQuestions(survey.questions);
    }
  },[survey])
  useEffect(()=>{
    if(questions && questionTypes && trees){
      setSurveyResult(questions.map(
        (questionData)=>(
          {
            // surveyId:survey.id,
            // questionId:questionData.id,
            answerOptionId:[],
            // farmId:trees[treeIndex].farmId,
            // visitId:trees[treeIndex].visitId,
            // treeId:trees[treeIndex].treeId,
            // labelingTaskId:2,
            // labelerId: 6,
            labels:[]
          }
        )
      ));
      setProgressIndicator(questions.map((question)=>false));
      setChosenOptions(
        questions.map((question)=>({questionType:questionTypes[question.questionTypeId],answers:[]}))
      )
    }
  },[questions,questionTypes,reload])


  useEffect(()=>{
    if(questions){
    questions.forEach((question)=>{
      if (question.mandatoryFlg){
        setTotalProgressNumber(previous=>previous+1)
      }
    })
  }
  },[questions])


  const changeIndex=(index)=>{
  var newIndex=index;
  if(index>questions.length-1){newIndex=0}
  if(index<0){newIndex=questions.length-1}
  return newIndex
  }

  const changeImageIndex=(index)=>{
    var newIndex=index;
  if(index>treeImages.length-1){newIndex=0}
  if(index<0){newIndex=treeImages.length-1}
  return newIndex
  }
  useEffect(()=>{
    if(treeImages && savedAnnotations && questions && surveyResult){
    const progressBar=document.getElementsByClassName('styles_progressBar__3w3FG')[0];
    console.log(progressBar)
    progressBar.style.setProperty('--progressWidth',currentProgress/totalProgressNumber);
    }
  },[totalProgressNumber,currentProgress])
  
  const handleSubmit=()=>{
    const errors=[];
    questions.forEach((question,index)=>{
    const {mandatoryFlg}=question;
      if(mandatoryFlg && !surveyResult[index].answerOptionId.length){
        errors.push('Submission failed answer required');
      }
      else if (chosenOptions[index].answers.requireLabelingFlg && !surveyResult[index].labels.length){
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
      if(treeIndex+1 <= trees.length-1){
      setReload(!reload);
      setSavedAnnotations(null)
      setImageIndex(0);
      setQuestionIndex(0);
      setTreeIndex(previous=>previous+1);
      setCurrentProgress(0)
      setIsSubmitted(false);
      let labels=[];
      surveyResult.forEach((result)=>{
        labels=[...labels,...result.labels];
      })
      console.log(labels);
      axios.post("labelingResult/saveList",labels)
      .then(response=>console.log(response))
      }
      else{
        navigate("/myTasks")
      }
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
              progress={{currentProgress,setCurrentProgress,progressIndicator,setProgressIndicator,setTotalProgressNumber}} />
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
                  savedAnno={{savedAnnotations,setSavedAnnotations}} 
                  progress={{currentProgress,setCurrentProgress,setTotalProgressNumber,progressIndicator,setProgressIndicator,mandatoryFlg:questions[questionIndex].mandatoryFlg}}
                  questionIndex={questionIndex} 
                  imageData={{imageUrl:treeImages[imageIndex].url,imageIndex:imageIndex}}
                  labelData={{surveyId:survey.id,questionId:questions[questionIndex].id,
                  imageId:treeImages[imageIndex].imageId,treeId:trees[treeIndex].id,visitId:trees[treeIndex].visitId,farmId:trees[treeIndex].farmId}}/>
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
