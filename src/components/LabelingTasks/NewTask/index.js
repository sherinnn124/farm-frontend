import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import styles from '../styles.module.css'
import newStyles from './styles.module.css'
import { IoIosPersonAdd } from "react-icons/io";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { IoIosRemoveCircle } from "react-icons/io";
import Loader from '../../shared/Loader'

function NewTask() {
    const navigate=useNavigate();
    const [treesDetection,setTreesDetection]=useState(null);
    const [showTable,setShowTable]=useState(false);
    const [selectedRun,setSelectedRun]=useState(null);
    const newLabelingTask={labelerId:'',surveyId:'',numOfTrees:0,numOfImages:0};
    const [labelingTasks,setLabelingTasks]=useState(null);
    const [selectedTreeTypes,setSelectedTreeTypes]=useState(null);
    const [mdEnumTreeTypes,setMdEnumTreeTypes]=useState(null)
    const [surveys,setSurveys]=useState(null);
    const [labelers,setLabelers]=useState(null);
    const [confirmedLabelingTask,setConfirmedLabelingTask]=useState(null);
    const [remaining,setRemaining]=useState(null);
    const [alert,setAlert]=useState({message:'',type:'',show:false});
    useEffect(()=>{
        axios.get('mdEnum/findByEnumId/2')
        .then(response=>{
            const treesTypes=response.data.items;
            const obj={};
            for(let i=0;i<treesTypes.length;i++){
                obj[treesTypes[i].code]=treesTypes[i].description
            }
            setMdEnumTreeTypes(obj)
        })
    },[])

    
    useEffect(()=>{
        axios.post('treeDetection/findTreeDetections',
        {
            filter: {
            preferedDetectionFlg: true,
            totalRecFlg: true,
            } 
        })
        .then(response=>setTreesDetection(response.data.items))
    },[])

    const handleChange=(e)=>{
        setSelectedRun(treesDetection[e.target.value])
        setShowTable(true)
    }


    useEffect(()=>{
        if(selectedRun){
            axios.post(`treeDetection/findTreeDetections`,
            {
                filter: {
                preferedDetectionFlg: true,
                totalRecFlg: false,
                tdRunId:selectedRun.tdRunId
                } 
            }
            )
            .then((response)=>setSelectedTreeTypes(response.data.items))
        }
    },[selectedRun])
    
    useEffect(()=>{
        if(selectedTreeTypes && !labelingTasks){
            setLabelingTasks(selectedTreeTypes.map((type)=>[]));
            setRemaining(
                selectedTreeTypes.map(
                    (type)=>({numOfImages:type.numImages,numOfTrees:type.numTrees})
                )
            )
        }
    },[selectedTreeTypes])

    
    useEffect(()=>{
            axios.get('survey')
            .then(res=>setSurveys(res.data.items))
            .catch(error=>console.log(error))
            axios.get('user')
            .then(res=>{setLabelers(res.data.items)})
            .catch(error=>console.log(error))
        },[])


    const addLabelingTask=(e,i)=>{
        const arrayTwo=[...labelingTasks]
        arrayTwo[i].push(newLabelingTask);
        setLabelingTasks(arrayTwo)
    }

    useEffect(()=>{
        if(confirmedLabelingTask){
            axios.post('labelingTask',{...confirmedLabelingTask,treeDetectionRunId:selectedRun.tdRunId})
            .then(response=>{
                setConfirmedLabelingTask(null);
                setAlert({msg:'Task added',type:'success',show:true})
            })
            .catch(e=>{
                setAlert({msg:'Task not assigned',type:'failiure',show:true})
                setConfirmedLabelingTask(null);
            })
        }
    },[confirmedLabelingTask])


    const removeLabeler=(treeTypeIndex,labelingTaskIndex)=>{
        const array=[...labelingTasks];
        array[treeTypeIndex].splice(labelingTaskIndex,1);
        setLabelingTasks(array);
    }

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
    { !(surveys && labelers && mdEnumTreeTypes)?<Loader/>:
    <div>
        {alert.show && 
        <div style={{position:'fixed',left:'50%',bottom:'1rem',transform:'translateX(-50%)'
        ,backgroundColor:alert.type=="success"?'#d4edda':'#f8d7da',zIndex:'1',padding:'0.5rem',borderRadius:'0.25rem'}}>
        {alert.msg}
        </div>}
        <h1 className={newStyles.newFarmHeading}>New labeling task</h1>
        <div>
            {treesDetection &&
                <div className={newStyles.selectFarmContainer}>
                    <label style={{marginRight:"0.5rem"}} htmlFor="farms">Select run </label>
                    <select name="selectedRun"  onChange={handleChange} defaultValue={"default"} className={newStyles.select}>
                    <option value={"default"} disabled hidden>Select...</option>
                        {
                            treesDetection.map((run,index)=>{
                                if(run.totalRecFlg==true){
                                    return(
                                        <option style={{cursor:'pointer'}} value={index} key={index}>{run.tdRunId}</option>
                                    )
                                }
                            })
                        }
                    </select>
                </div>
            }
            {showTable && selectedTreeTypes && mdEnumTreeTypes &&
            <div className='container' style={{marginTop:'2rem'}}>
                <table >
                    <thead>
                        <tr>
                            <th>FarmID</th>
                            <th>Total Number Of Trees</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{selectedRun.farmId}</td>
                            <td>{selectedRun.numTrees}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            }
            {
                showTable && selectedTreeTypes && mdEnumTreeTypes &&
                <div className='container' style={{marginTop:'2rem'}}>
                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Tree Type</th>
                                    <th>Trees Number</th>
                                    <th>Images Number</th>
                                    <th>Survey</th>
                                    <th>Labeler</th>
                                    <th>Progress</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                            selectedTreeTypes.map((treeType,index)=>{
                                const{numTrees,numImages,treeTypeId}=treeType;
                                return(
                                    <React.Fragment key={index}>
                                    <tr>
                                        <td>
                                            {`${mdEnumTreeTypes[treeTypeId]}`}
                                        </td>
                                        <td>{numTrees}</td>
                                        <td>{numImages}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>Progress</td>
                                        <td><button className='action' style={{fontSize:'1.5rem',color:'var(--farm-btn)'}} onClick={(e)=>{addLabelingTask(e,index)}}><IoIosPersonAdd/></button></td>
                                    </tr>
                                    {   labelingTasks&&
                                        labelingTasks[index].map((task, i) => {
                                            
                                            const assignInput=(event)=>{
                                                let {name,value}=event.target;
                                                value=isNaN(parseInt(value))?0:parseInt(value);
                                                if(value <= remaining[index][name] ){
                                                    const subtractedValue=labelingTasks[index][i][name]-value;
                                                    let treeTypeProperty=name.replace("Of","")
                                                    let array=[...selectedTreeTypes];
                                                    array[index]={...array[index],[treeTypeProperty]:array[index][treeTypeProperty]+subtractedValue};
                                                    setSelectedTreeTypes(array);
                                                }
                                                else if(value <labelingTasks[index][i][name]){
                                                    let treeTypeProperty=name.replace("Of","")
                                                    let array=[...selectedTreeTypes];
                                                    const addedValue=labelingTasks[index][i][name]-value;
                                                    array[index][treeTypeProperty]=array[index][treeTypeProperty] + addedValue;
                                                        setSelectedTreeTypes(array);
                                                }
                                                if(value <= remaining[index][name] || value<labelingTasks[index][i][name] || name=="surveyId" || name=="labelerId"){
                                                    const assignArray=[...labelingTasks];
                                                    assignArray[index][i]={...assignArray[index][i],[name]:value};
                                                    setLabelingTasks(assignArray);
                                                }
                                                
                                            }
                                            const passRemaining=(e)=>{
                                                let {name,value}=e.target;
                                                let treeTypeProperty=name.replace("Of","");
                                                value=isNaN(parseInt(value))?0:parseInt(value);
                                                const array={...remaining};
                                                if(e.type=="blur"){
                                                array[index][name]=selectedTreeTypes[index][treeTypeProperty];
                                                }
                                                else if(e.type="focus"){
                                                    array[index][name]=selectedTreeTypes[index][treeTypeProperty] +value;
                                                }
                                                setRemaining(array)
                                            }

                                            return (
                                                <tr key={i}>
                                                    <td></td>
                                                    <td><input  name={"numOfTrees"} onFocus={passRemaining} value={labelingTasks[index][i].numOfTrees} onChange={assignInput} onBlur={passRemaining} /></td>
                                                    <td><input  name={"numOfImages"} onFocus={passRemaining} value={labelingTasks[index][i].numOfImages} onChange={assignInput} onBlur={passRemaining}/></td>
                                                    <td>
                                                        <select name={"surveyId"}  onChange={assignInput} defaultValue={"default"}>
                                                        <option value={"default"} disabled hidden>Select survey</option>
                                                            {surveys.map((survey,i)=>{
                                                                return (
                                                                    <option  key={survey.id} value={survey.id}>{survey.surveyTitle}</option>
                                                                )
                                                            })
                                                            }
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select name={"labelerId"} onChange={assignInput} defaultValue={"default"}>
                                                        <option value={"default"} disabled hidden>Select Labeler</option>
                                                        {
                                                        labelers.map((labeler,i)=>{
                                                            return <option key={labeler.id} value={labeler.id}>{labeler.name}</option>
                                                        })
                                                        }
                                                        </select>
                                                    </td>
                                                    <td>-</td>
                                                    <td style={{display:'flex'}}>
                                                        <button className='action success' onClick={()=>setConfirmedLabelingTask(labelingTasks[index][i])} ><MdOutlineAssignmentTurnedIn/></button>
                                                        <button className='action remove' onClick={()=>removeLabeler(index,i)} ><IoIosRemoveCircle/></button>
                                                    </td>
                                                
                                                </tr>
                                            )
                                        })
                                    } 
                                        
                                    </React.Fragment>
                        
                                )
                                })
                            }
                            </tbody>
                        </table>
                        </div>
                </div>
            }
        </div>
        <div className="container">
            <button type='button' onClick={()=>navigate('/farms')} style={{display:'block',margin:'2rem auto 2rem auto'}} className='btn'>All tasks</button>
        </div>
    </div>
    }
    </>
  )
}

export default NewTask
