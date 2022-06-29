import React,{useEffect, useState} from 'react'
import Question from './Question'
import styles from './styles.module.css'
import { IoArrowDown,IoSend } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import Select from 'react-select'
import {customStyles,customTheme} from '../../../services/service'
import axios from 'axios';
import Loader from '../../shared/Loader';
function NewSurvey() {
    const[questionsNumber,setQuestionsNumber]=useState(1);
    const[survey,setSurvey]=useState(null);
    const[generatedColors,setGeneratedColors]=useState([]);
    const [questionTypes,setQuestionTypes]=useState(null);
    const[treeTypes,setTreeTypes]=useState(null);
    const [sendSurvey,setSendSurvey]=useState(false);
    const [treeTypesOptions,setTreeTypesOptions]=useState(null);
    const [selectedOption,setSelectedOption]=useState(null);
    const [isLoading,setIsLoading]=useState(true)
    const {id}=useParams();


    useEffect(()=>{
        if(!id){
            setSurvey({surveyTitle:'Untitled survey',treeTypeDesc: "string",treeTypeId: "",questions:[{text:'Untitled Question',questionOrder:1,color: "string",options:[{optionText:"",value:"",optionOrder:1,requireLabelingFlg:false,optionColor:""}],questionTypeId:"",mandatoryFlg:false}]});
        }
        else{
            axios.get(`survey/${id}`)
            .then((response)=>setSurvey(response.data.items))
            .catch(error=>console.log(error))
        }
    },[])



    useEffect(()=>{
        axios.get('/mdEnum/findByEnumId/3')
        .then(res=>{
            const qtypes=res.data.items;
            setQuestionTypes(qtypes.map((type)=>({description:type.description,code:type.code})))
        })
        .then(res=>{
            axios.get('/mdEnum/findByEnumId/2')
            .then(res=>{
                const tTypes=res.data.items;
                setTreeTypes(tTypes.map((type)=>({description:type.description,code:type.code})))
            })
        })
    },[])

    useEffect(()=>{
        if(treeTypes && questionTypes && survey){
                setIsLoading(false)
        }
    },[treeTypes,questionTypes])

    useEffect(()=>{
        if(treeTypes){
            setTreeTypesOptions(
                treeTypes.map((option)=>
                    (
                        {
                            value:option.code,
                            label:option.description
                        }
                    )
                )
            )
        }
    },[treeTypes])

    useEffect(()=>{
        if(treeTypesOptions && questionTypes && survey){
                setSelectedOption(
                    treeTypesOptions.filter((option)=>option.value==survey.treeTypeId)
                )
        }
    },[treeTypesOptions,questionTypes,survey])

    const handleSelect=(e)=>{
        setSelectedOption(e);
        setSurvey({...survey,treeTypeId:`${e.value}`})
    }
    const handleChange=(e)=>{
        const{name,value}=e.target;
        setSurvey({...survey,[name]:value})
    }

    // const setHeight=(fieldId)=>{
    //     document.getElementById(fieldId).style.height = "";
    //     document.getElementById(fieldId).style.height = document.getElementById(fieldId).scrollHeight+'px';
    // }



    const newQuestion=()=>{
        setQuestionsNumber(prev=>prev+1);
        setSurvey({...survey,questions:[...survey.questions,{text:'Untitled Question',questionOrder:questionsNumber+1,options:[{optionText:"",value:"",optionOrder:1,requireLabelingFlg:false,optionColor:""}],questionTypeId:"",mandatoryFlg:false}]})
    }
    const removeQuestion=(questionIndex)=>{
        const obj={...survey};
        obj.questions.splice(questionIndex,1);
        setQuestionsNumber(prev=>prev-1);
        for(let i=questionIndex;i<obj.questions.length;i++){
            obj.questions[i].questionOrder=i+1
        }
        setSurvey(obj)
    }


    const setSurveyChange=(name,value,questionIndex,optionIndex)=>{
        const surveyData={...survey};
        if(name!='possibleAnswer'){
        surveyData.questions[questionIndex][name]=value;
        }
        else{
            surveyData.questions[questionIndex].options[optionIndex].optionText=value;
        }
        setSurvey(surveyData);
    }
    useEffect(()=>{
    if(sendSurvey){
        if(!id){
            axios.post('survey',survey)
            .then((response)=>{
                console.log(response);
                setSendSurvey(false);
            })
            .catch((error)=>console.log(error))
        }
        else{
            axios.put(`survey/${id}`,survey)
            .then((response)=>{
                console.log(response);
                setSendSurvey(false)
            })
            .catch(error=>console.log(error))
        }
    }
    },[sendSurvey])


return (
    <>
    {isLoading?
    <Loader/>:
    <div style={{marginBottom:'3rem'}}>
        { survey&&treeTypes&&treeTypesOptions&&
        <>
        <div className={`${styles.surveyInfo} ${styles.container}`}>
            <input type="text" onChange={handleChange} value={survey.surveyTitle} name="surveyTitle" style={{fontSize:'2rem'}}/>
            {/* <textarea placeholder="survey description" name="surveyDescription" onChange={handleChange} id="surveyDescription" value={survey.surveyDescription}  onKeyUp={()=>setHeight('surveyDescription')} onKeyDown={()=>setHeight('surveyDescription')}></textarea> */}
        </div>
        <div className={styles.container}>
            <Select isSearchable={true} styles={customStyles} theme={customTheme}
            value={selectedOption} options={treeTypesOptions} onChange={handleSelect} placeholder={"Select tree type..."} />
        </div>
            {
                survey.questions.map((question,index)=>{
                    return(
                        <Question key={index} questionTypes={questionTypes} questionData={{question,questionIndex:index,removeQuestion}} colors={{generatedColors,setGeneratedColors}} surveyData={{survey,setSurvey,setSurveyChange,id}} />
                    )
                })
            }
            <div style={{textAlign:'center'}}>
                <button className='btn' style={{marginRight:'1rem'}} onClick={newQuestion}><IoArrowDown/> Add question</button>
                <button className='btn'  onClick={()=>setSendSurvey(true)}><IoSend/> {!id?'Send':'Edit'} survey</button>
            </div>
        </>
        }
    </div>
    }
    </>
  )
}

export default NewSurvey
