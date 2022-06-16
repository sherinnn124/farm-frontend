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
  const [surveyResult,setSurveyResult]=useState(questions.map((questionData)=>({question:questionData.question,answer:[],labels:[]})));
  // const [treeImages,setTreeImages]=useState(["/Hallstatt.jpg","/treeOne.jpg"]);
  const [treeImages,setTreeImages]=useState(null);
  const [totalProgressNumber,setTotalProgressNumber]=useState(0);
  const [currentProgress,setCurrentProgress]=useState(0);
  const [progressIndicator,setProgressIndicator]=useState(questions.map((question)=>false));
  const [imageIndex,setImageIndex]=useState(0);
  // const [savedAnnotations,setSavedAnnotations]=useState([treeImages.map((tree)=>[])]);
  const [savedAnnotations,setSavedAnnotations]=useState(null);
  const [alert,setAlert]=useState({message:'',type:'',show:false});
  const [isSubmitted,setIsSubmitted]=useState(false);


  useEffect(()=>{
    axios.get('treeAnalysis')
    .then(response=>{
      const tree=response.data.items[0].treeAnalysisDtls.filter((tree)=>tree.treeRef== "farm0.mango_seedlings.1");
      setTreeImages(tree.map((image)=>`http://34.66.190.29:8080/imagetool-be/videoImage/getImage/1/${image.treeRef}/${image.imageName}`));
    })
  },[])


  useEffect(()=>{
    if(treeImages){
    setSavedAnnotations([treeImages.map((tree)=>[])]);
    }
  },[treeImages])


  useEffect(()=>{
    questions.forEach((question)=>{
      const {labeling,required}=question;
      if ((labeling&&required)||(labeling&&!required)|| (!labeling&&required)){
        setTotalProgressNumber(previous=>previous+1)
      }
    })
  },[])
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
    const progressBar=document.getElementsByClassName('styles_progressBar__3w3FG')[0];
    progressBar.style.setProperty('--progressWidth',currentProgress/totalProgressNumber);
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
  // const getImages= async ()=>{
  //   try{
  //     const response=await axios.get('videoImage/getImage/1/2');
  //     console.log(response);
  //     const dataa=await response.data;
  //     setTreeImages(dataa) 
  //     // setTreeImages( await response.data) 
  //     // const response=await axios.get('https://jsonplaceholder.typicode.com/photos/1');
  //   }
  //   catch(error){
  //     console.log(error)
  //   }
  // }
  // useEffect(()=>{
  //   getImages()
  // }
  // ,[])
  return (
    <div className={`container ${styles.container}`}>
      {alert.show && 
      <div style={{position:'fixed',left:'50%',bottom:'1rem',transform:'translateX(-50%)'
      ,backgroundColor:alert.type=="success"?'#d4edda':'#f8d7da',zIndex:'1',padding:'0.5rem',borderRadius:'0.25rem'}}>
      {alert.msg}
      </div>}
      {treeImages && savedAnnotations&&
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tree-{treeId}</th>
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
  )
}

export default AnswerLabelSurvey
