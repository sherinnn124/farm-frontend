import React,{useEffect, useState,useRef} from 'react'
import styles from './styles.module.css'
import Select from 'react-select'
import { IoCheckbox,IoCloseOutline,IoRefresh} from "react-icons/io5";
import { MdShortText,MdOutlineRadioButtonChecked,MdClose} from "react-icons/md";
import {BsToggleOff,BsToggleOn} from "react-icons/bs";
import {FaCircle} from "react-icons/fa";
import {customStyles,customTheme, generateColor} from '../../../services/service'

function Question({surveyData,questionData,colors,questionTypes}) {
    const {questionIndex} = questionData;
    const question=questionData.question;
    const {id,setSurveyChange}=surveyData;
    const [selectedOption,setSelectedOption]=useState(null);
    const option={optionText:"",value:"",optionOrder:"",requireLabelingFlg:false,optionColor:""};
    const [options,setOptions]=useState(null);

    const optionKeyValue=(key,typeDescription)=>{
        if(typeDescription==="text"){
            return(key=='label'?
            (<div>
                <MdShortText /> Short answer
            </div>):true
            )
        }
        else if(typeDescription==="radio"){
            return(key==='label'?
            (<div>
                <MdOutlineRadioButtonChecked/> Radio answer
            </div>
            ):false
            )
        }
        else if(typeDescription==="checkbox"){
            return(key=='label'?
            (<div>
                <IoCheckbox /> Checkboxes 
            </div>):true
            )
        }
        else{
            return(key=='label'?typeDescription
            :true)
        }
    }
    useEffect(()=>{
    setOptions(
        questionTypes.map((type)=>
    (   
        {
            value:type.code,
            label:optionKeyValue('label',type.description),
            isDisabled:optionKeyValue('isDisabled',type.description),
            description:type.description
        }
    )
    )    
    ) 
    },[])
    useEffect(()=>{
        if(options && !surveyData.id){
            const radioOption=options.filter((option)=>option.description=="radio");
            setSelectedOption(radioOption[0]);
            setSurveyChange('questionTypeId',radioOption[0].value,questionIndex);
        }
        else if(options && surveyData.id){
            setSelectedOption(
                options.filter((option)=>option.value==surveyData.survey.questions[questionIndex].questionTypeId)[0]
            )
        }
    },[options])





    // useEffect(()=>{
    //     if(!id){
    //         setArrayOptions([{optionText:"",value:"",requireLabelingFlg:false,optionColor:""}])
    //     }
    //     else{
    //         setArrayOptions(question.options);
    //         // setSelectedOption(options.filter((option)=>option.value==question.questionTypeId));
    //     }
    // },[])



    const handleChange=(e,i)=>{
        const {name,value}=e.target;
        if(name!='possibleAnswer'){
            setSurveyChange(name,value,questionIndex)
        
        }
        else{
            setSurveyChange(name,value,questionIndex,i)
        }
    }
    const handleSelect=(e,questionTypeId)=>{
        setSelectedOption(e);
        setSurveyChange('questionTypeId',e.value,questionIndex);
    }



    const toggleRequirement=(name,optionIndex)=>{
        if(name==="requireLabelingFlg"){
            const obj={...surveyData.survey};
            obj.questions[questionIndex].options[optionIndex].requireLabelingFlg =!(obj.questions[questionIndex].options[optionIndex].requireLabelingFlg);
            surveyData.setSurvey(obj);
        }
        else{
            setSurveyChange(name,!(question[name]),questionIndex)
        }
    }

    const handleLabeling=(optionIndex)=>{
        if(question.options[optionIndex].requireLabelingFlg){
            changeColor(optionIndex,true,false)
        }
        else{
            changeColor(optionIndex,false,question.options[optionIndex].optionColor)
        }
    }

    const changeColor=(optionIndex,change,removedColor)=>{
        if(change){
        let color=generateColor();
        const isRepeated=colors.generatedColors.some((generatedColor)=>generatedColor===color);
        if(isRepeated){console.log("repeated");changeColor(optionIndex,change,removedColor)}
        else{
        const obj= {...surveyData.survey};
        obj.questions[questionIndex].options[optionIndex].optionColor=color;
        surveyData.setSurvey(obj);
        if(removedColor){
        colors.setGeneratedColors([...colors.generatedColors.filter((color)=>color!==removedColor),color]);
        }
        else{
        colors.setGeneratedColors([...colors.generatedColors,color]);    
        }
        }
        }
        else{
            colors.setGeneratedColors([...colors.generatedColors.filter((color)=>color!==removedColor)]);
            const obj= {...surveyData.survey};
            obj.questions[questionIndex].options[optionIndex].optionColor="";
            surveyData.setSurvey(obj);
        }
    }




    const newOption=()=>{
        const arrayTwo={...surveyData.survey};
        arrayTwo.questions[questionIndex].options.push(option);
        const optionsLength=arrayTwo.questions[questionIndex].options.length;
        arrayTwo.questions[questionIndex].options[optionsLength-1].optionOrder=optionsLength;
        surveyData.setSurvey(arrayTwo)
    }
    const removeOption=(e,index)=>{
        let obj= {...surveyData.survey};
        obj.questions[questionIndex].options.splice(index,1);
        const optionsLength=obj.questions[questionIndex].options.length;
        for(let i=index;i<optionsLength;i++){
            obj.questions[questionIndex].options[i].optionOrder=i+1;
        }
        surveyData.setSurvey(obj);
    }



  return (
    <>
        <div className={`${styles.question} ${styles.container}`}>
            <div style={{textAlign:'right',marginBottom:'0.25rem'}}>
                <button className='action' onClick={()=>questionData.removeQuestion(questionIndex)}>
                    <MdClose/>
                </button>
            </div>
            <div className={styles.questionAndType}>
                <input type="text" name="text" value={question.text} onChange={handleChange}/>
                <Select  isSearchable={false} styles={customStyles} theme={customTheme}
                value={selectedOption} options={options} isOptionDisabled={(option) => option.isDisabled==true}
                onChange={(e)=>handleSelect(e,'answerType')} className={styles.select}/>
            </div>
            <div>
            {question.options.map((option,index)=>{
                if( selectedOption && selectedOption.description!='text'){
                return(
                    <div key={index} className={styles.answer}>
                        <div className={styles.multiOptions}>
                            <input type={selectedOption.description} disabled/>
                            <input type="text" name="possibleAnswer" value={question.options[index].optionText} onChange={(e)=>handleChange(e,index)} placeholder={`option ${index+1}`}/>
                            {question.options.length!==1&&<button className={`action`} onClick={(e)=>removeOption(e,index)}><IoCloseOutline/></button>}
                            <button className='action' value={question.options[index].requireLabelingFlg} onClick={()=>{toggleRequirement('requireLabelingFlg',index);handleLabeling(index);}}>{!question.options[index].requireLabelingFlg?<BsToggleOff/>:<BsToggleOn/>}</button>
                            {option.requireLabelingFlg &&
                            <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                                <div style={{color:`#${option.optionColor}`}}>
                                    <FaCircle/>
                                </div>
                                <button style={{cursor:'pointer',fontSize:'1.25rem'}} className='action' onClick={()=>{changeColor(index,true,option.optionColor)}}>
                                    <IoRefresh/>
                                </button>
                            </div>
                            }
                        </div>
                        {index==question.options.length-1&&
                        <div className={styles.multiOptions} style={{width:'100px'}}>
                            <input type={selectedOption.description} disabled/>
                            <input type="text" onClick={newOption} placeholder="Add Option" style={{width:'100px'}}/>
                        </div>}
                    </div>
                )
                }
            })
            }
            {
                selectedOption && selectedOption.description=='text' &&
                <input  type={selectedOption.description} disabled name="" placeholder="Text answer" style={{height:'2rem',marginTop:'1rem'}}/>
            }
            </div>
            <div>
                <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',marginTop:'1rem'}}>
                    <div style={{display:'flex',gap:'0.5rem'}}>
                        <span>Required</span>
                        <button className='action' value={question.mandatoryFlg} onClick={()=>toggleRequirement('mandatoryFlg')}>{!question.mandatoryFlg?<BsToggleOff/>:<BsToggleOn/>}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Question
