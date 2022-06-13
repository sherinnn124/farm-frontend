import React,{useEffect, useState,useRef} from 'react'
import styles from './styles.module.css'
import Select from 'react-select'
import { IoCheckbox,IoCloseOutline,IoRefresh} from "react-icons/io5";
import { MdShortText,MdOutlineRadioButtonChecked} from "react-icons/md";
import {BsToggleOff,BsToggleOn} from "react-icons/bs";
import {FaCircle} from "react-icons/fa";
import {customStyles,customTheme, generateColor} from '../../../services/service'
// import {generateColor} from '../../../services/service'
function Question({surveyData,questionData}) {
    const {questionIndex} = questionData;
    const [question,setQuestion]=useState(questionData.question);
    const {id,setSurveyChange,survey,setSurvey}=surveyData;
    const [selectedOption,setSelectedOption]=useState(null);
    const [arrayOptions,setArrayOptions]=useState(['']);
    console.log(question.color)
    const options = [
        { value: 'text',
        label: (
            <div>
                <MdShortText /> Short answer
            </div>
        ) },
        { value: 'radio',
        label: (
            <div>
                <MdOutlineRadioButtonChecked/> Multiple choice
            </div>
        ) },
        { value: 'checkbox',
        label: (
            <div>
                <IoCheckbox /> Checkboxes
            </div>
        ) },
    ];
    useEffect(()=>{
        if(!id){
            setArrayOptions([''])
        }
        else{
            setArrayOptions(question.answers);
            setSelectedOption(options.filter((option)=>option.value==question.answerType));
        }
    },[])


    const handleChange=(e,i)=>{
        const {name,value}=e.target;
        if(name!='possibleAnswer'){
            setQuestion({...question,[name]:value})
            setSurveyChange(name,value,questionIndex)
        
        }
        else{
            const array=[...arrayOptions];
            array[i]=value;
            setArrayOptions(array);
            setQuestion({...question,answers:array});
            setSurveyChange(name,value,questionIndex,i)
        }
    }
    const handleSelect=(e,answerType)=>{
        setSelectedOption(e);
        setQuestion({...question,[answerType]:e.value});
        setSurveyChange('answerType',e.value,questionIndex);
    }
    const changeColor=()=>{
        let color=generateColor();
        setQuestion({...question,color:color});
        setSurveyChange('color',color,questionIndex)
    }

    useEffect(()=>{
        if(question.answerType!="text"&&question.answers.length=="0"){
            setArrayOptions([''])
        }
        else if(question.answers.length&&question.answerType=="text"){
            setSurveyChange('answers',[],questionIndex);
            setArrayOptions([''])
        }
    },[question.answerType])
    
    const isInitialMount = useRef(true);
    useEffect(()=>{
    if (isInitialMount.current) {
            isInitialMount.current = false;
    } 
    else {
        if(question.labeling){
            const color=generateColor()
            setQuestion({...question,color:color});
            setSurveyChange('color',color,questionIndex);
        }
        else{
            setQuestion({...question,color:''});
            setSurveyChange('color','',questionIndex);
        }
    }
    },[question.labeling])

    const newOption=()=>{
        const array= [...arrayOptions];
        array.push('');
        setArrayOptions(array)
    }
    const removeOption=(e,index)=>{
        let array= [...arrayOptions];
        array.splice(index,1);
        setArrayOptions(array);
        setQuestion({...question,answers:array})
    }
    const toggleRequirement=(name)=>{
        setQuestion({...question,[name]:!(question[name])})
        setSurveyChange(name,!(question[name]),questionIndex)
    }


  return (
    <>
        <div className={`${styles.question} ${styles.container}`}>
            <div className={styles.questionAndType}>
                <input type="text" name="question" value={question.question} onChange={handleChange}/>
                <Select isSearchable={false} styles={customStyles} theme={customTheme} value={selectedOption} options={options}  onChange={(e)=>handleSelect(e,'answerType')} className={styles.select}/>
            </div>
            <div>
            {arrayOptions.map((answer,index)=>{
                if(question.answerType!='text'){
                return(
                    <div key={index} className={styles.answer}>
                        <div className={styles.multiOptions}>
                            <input type={question.answerType} disabled/>
                            <input type="text" name="possibleAnswer" value={arrayOptions[index]} onChange={(e)=>handleChange(e,index)} placeholder={`option ${index+1}`}/>
                            {arrayOptions.length!==1&&<button className={`action`} onClick={(e)=>removeOption(e,index)}><IoCloseOutline/></button>}
                        </div>
                        {index==arrayOptions.length-1&&
                        <div className={styles.multiOptions} style={{width:'100px'}}>
                            <input type={question.answerType} disabled/>
                            <input type="text" onClick={newOption} placeholder="Add Option" style={{width:'100px'}}/>
                        </div>}
                    </div>
                )
                }
            })
            }
            {
                question.answerType=='text'&&
                <input  type={question.answerType} disabled name="" placeholder="Text answer" style={{height:'2rem',marginTop:'1rem'}}/>
            }
            </div>
            <div>
                <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',marginTop:'1rem'}}>
                    <div style={{display:'flex',gap:'0.5rem'}}>
                        <span>Required</span>
                        <button className='action' value={question.required} onClick={()=>toggleRequirement('required')}>{!question.required?<BsToggleOff/>:<BsToggleOn/>}</button>
                    </div>
                    <div style={{display:'flex',gap:'0.5rem'}}>
                        <span>Labeling</span>
                        <button className='action' value={question.labeling} onClick={()=>toggleRequirement('labeling')}>{!question.labeling?<BsToggleOff/>:<BsToggleOn/>}</button>
                    </div>
                
                </div>
                {question.labeling &&
                    <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                    Labeling Color :
                    <div style={{color:`#${question.color}`}}>
                        <FaCircle/>
                    </div>
                    <button style={{cursor:'pointer',fontSize:'1.25rem'}} className='action' onClick={changeColor}>
                        <IoRefresh/>
                    </button>
                </div>
                }
            </div>
        </div>
    </>
  )
}

export default Question
