import React, { useEffect, useState,useContext} from 'react'
import { useNavigate,useLocation,Navigate } from 'react-router-dom';
import {LabelTwo} from './LabelTwo'
import Answer from './Answer'
import styles from './styles.module.css'
import {MdOutlineNavigateNext,MdOutlineNavigateBefore} from 'react-icons/md'
import axios from 'axios'
import { questionTypesContext } from '../../App'
import { navbarContext } from '../../App';
import Loader from '../shared/Loader'
function AnswerLabelSurvey() {
  const [survey,setSurvey]=useState(null);
  const [questions,setQuestions]=useState(null)
  const [questionIndex,setQuestionIndex]=useState(0);
  const [surveyResult,setSurveyResult]=useState(null);
  const [treesRecordId,setTreesRecordId]=useState(null);
  const [currentTree,setCurrentTree]=useState(null)
  const [currentTreeId,setCurrentTreeId]=useState(null);
  const [treeIndex,setTreeIndex]=useState(0);
  const [treeImages,setTreeImages]=useState(null);
  const [imageIndex,setImageIndex]=useState(0);
  const [totalProgressNumber,setTotalProgressNumber]=useState(0);
  const [currentProgress,setCurrentProgress]=useState(0);
  const [progressIndicator,setProgressIndicator]=useState(null);
  const [savedAnnotations,setSavedAnnotations]=useState(null);
  const [alert,setAlert]=useState({message:'',type:'',show:false});
  const [isSubmitted,setIsSubmitted]=useState(false);
  const [chosenOptions,setChosenOptions]=useState(null);
  const [reload,setReload]=useState(true);
  const questionTypes=useContext(questionTypesContext);
  const navigate=useNavigate();
  const navbar=useContext(navbarContext);
  const state=useLocation().state;
  useEffect(()=>{
    if(state){
      axios.get(`labelingTaskTrees/findLabelTaskId/${state.labelingTaskId}`)
      .then(response=>{
        const data=response.data.items;
        setTreesRecordId(
          data.map((item)=>item.treeId)
        );
      })
    }
  },[state])

  useEffect(()=>{
    if(treesRecordId){
      axios.get(`tree/${treesRecordId[treeIndex]}`)
      .then(response=>{
        setCurrentTree(response.data.items);
        setCurrentTreeId(response.data.items.treeId)
      })
    }
  },[treesRecordId,treeIndex])

  useEffect(()=>{
    if(treesRecordId && state && currentTreeId){
      axios.get(`treeImage/findByTreeDetectionId/${state.tdRunId}/${currentTreeId}`)
      .then(response=>{
        setTreeImages(
          response.data.items.map(
          (image)=>({url:`http://34.66.190.29:8080/imagetool-be/treeImage/getImageBak/${image.id}`,imageId:image.id})
          )
        )
          }
      )
    }
  },[treesRecordId,treeIndex,currentTreeId])

  useEffect(()=>{
    if(state){
    axios.get(`survey/${state.surveyId}`)
    .then(response=>setSurvey(response.data.items))
    }
  },[state])

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
    if(questions && questionTypes){
      setSurveyResult(questions.map(
        (questionData)=>(
          {
            answerOptionId:[],
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
      if(treeIndex+1 <= treesRecordId.length-1){
      setReload(!reload);
      setSavedAnnotations(null)
      setImageIndex(0);
      setQuestionIndex(0);
      setCurrentTreeId(null);
      setTreeIndex(previous=>previous+1);
      setCurrentProgress(0)
      setIsSubmitted(false);
      let labels=[];
      surveyResult.forEach((result)=>{
        labels=[...labels,...result.labels];
      })

      axios.post("labelingResult/saveList",labels)
      .then(response=>console.log(response))
      }
      else{
        navigate("/myTasks")
      }
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

  useEffect(()=>{
    if(navbar){
      navbar.setNavbarHidden(true);
    }
  })

   return (
    <>
      {alert.show && 
      <div style={{position:'fixed',left:'50%',bottom:'1rem',transform:'translateX(-50%)'
      ,backgroundColor:alert.type=="success"?'#d4edda':'#f8d7da',zIndex:'1',padding:'0.5rem',borderRadius:'0.25rem'}}>
      {alert.msg}
      </div>}
      {treeImages && savedAnnotations && questions && surveyResult&& currentTree ?
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tree-{currentTreeId}</th>
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
            <td className={styles.answerTd} style={{width:window.innerWidth*1/4}}>
              <Answer questionData={{question:questions[questionIndex],questionIndex}} 
              survey={{surveyResult,setSurveyResult,chosenOptions,setChosenOptions}}
              progress={{currentProgress,setCurrentProgress,progressIndicator,setProgressIndicator,setTotalProgressNumber}} />
              <div>
                <button onClick={()=>setQuestionIndex(changeIndex(questionIndex-1))} className={styles.nav}><MdOutlineNavigateBefore/></button>
                <button onClick={()=>setQuestionIndex(changeIndex(questionIndex+1))} className={styles.nav}><MdOutlineNavigateNext/></button>
              </div>
            </td>
            <td className={styles.labelTd} style={{width:window.innerWidth*3/4}}>
                <button className={`${styles.nav} ${styles.previous}`} onClick={()=>setImageIndex(changeImageIndex(imageIndex-1))}><MdOutlineNavigateBefore/></button>
                <button className={`${styles.nav} ${styles.next}`} onClick={()=>setImageIndex(changeImageIndex(imageIndex+1))}><MdOutlineNavigateNext/></button>
                {treeImages&&
                  <LabelTwo survey={{surveyResult,setSurveyResult,chosenOptions}} 
                  savedAnno={{savedAnnotations,setSavedAnnotations}} 
                  progress={{currentProgress,setCurrentProgress,setTotalProgressNumber,progressIndicator,setProgressIndicator,mandatoryFlg:questions[questionIndex].mandatoryFlg}}
                  questionIndex={questionIndex} 
                  imageData={{imageUrl:treeImages[imageIndex].url,imageIndex:imageIndex}}
                  labelData={{
                  surveyId:survey.id,questionId:questions[questionIndex].id,
                  imageId:treeImages[imageIndex].imageId,
                  treeId:currentTreeId,
                  visitId:currentTree.visitId,
                  farmId:currentTree.farmId,
                  labelingTaskId:state.labelingTaskId,
                  tdRunId:state.tdRunId,
                  labelerId:state.labelerId
                }}/>
                }
            </td>
          </tr>
        </tbody>
      </table>:<Loader/>
      }
    </>
  )
}

export default AnswerLabelSurvey