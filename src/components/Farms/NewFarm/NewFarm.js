import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import styles from '../styles.module.css'
import newStyles from './styles.module.css'
import data from './data'
import { IoIosPersonAdd } from "react-icons/io";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { IoIosRemoveCircle } from "react-icons/io";

function NewFarm() {
    // const[farms,setFarms]=useState([]);
    // const[surveys,setSurveys]=useState([]);
    // const[labelers,setLabelers]=useState([]);
    const navigate=useNavigate();
    const[farms,setFarms]=useState(data.farms);
    const[surveys,setSurveys]=useState(data.surveys);
    const[labelers,setLabelers]=useState(data.labelers);
    const [showTable,setShowTable]=useState(false);
    const[newFarm,setFarm]=useState(null);
    const [treesLabelers,setTreesLabelers]=useState([]);
    // const [assignLabelerSurvey,setAssignLabelerSurvey]=useState({labelerId:'',surveyId:'',treesNumber:'',imagesNumber})
    const newlabelerSurvey={labelerId:'',surveyId:'',treesNumber:0,imagesNumber:0};
    const [labelersSurvey,setLabelersSurvey]=useState(null)




    useEffect(()=>{
        if(newFarm){
            setTreesLabelers(Array(newFarm.trees.length).fill(0));
            setLabelersSurvey(Array.from(Array(newFarm.trees.length), () => []))
            console.log(labelersSurvey)
        }
    },[newFarm])


    const inputChange=(e)=>{
        setFarm(farms[e.target.value]);
        setShowTable(true)
    }
    useEffect(()=>{
        console.log("hi")
    })

    const newLabeler=(e,i)=>{
        const array=[...treesLabelers];
        ++array[i];
        setTreesLabelers(array);
        const arrayTwo=[...labelersSurvey]
        arrayTwo[i].push(newlabelerSurvey);
        setLabelersSurvey(arrayTwo)
    }
        const addFarm=()=>{
        // const today=new Date();
        // const date=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        // setFarm({...newFarm,updated:date})
        // axios.post('',newFarm)
    }
    const assignLabeler=(treeIndex,labelerIndex,treeId)=>{
        // const labeler={...labelersSurvey[treeIndex][labelerIndex],farmId:newFarm.id,treeId};
        // axios.post('',labeler)
    }
    const removeLabeler=(treeIndex,labelerIndex)=>{
        const array=[...labelersSurvey];
        array[treeIndex].splice(labelerIndex,1);
        setLabelersSurvey(array);
        const arrayTwo=[...treesLabelers];
        --arrayTwo[treeIndex];
        setTreesLabelers(arrayTwo);
    }

    useEffect(()=>{
    //getting farms
        // axios.get('')
        // .then(res=>setFarms(res.data.farms))
        // .catch(e=>)
    //gettingSurveys
        // axios.get()
        // .then(res=>setSurveys(res.data.surveys))
        // .catch(e=>)
    //getting labelers
        // axios.get()
        // .then(res=>setSurveys(res.data.surveys))
        // .catch(e=>)
    },[])
  return (
    <div>
        <h1 className={newStyles.newFarmHeading}>New Farm</h1>
        <div>
            <div className={newStyles.selectFarmContainer}>
                <label style={{marginRight:"0.5rem"}} htmlFor="farms">Select Farm</label>
                <select name="farms" id="farms" onChange={inputChange} defaultValue={"default"} className={newStyles.select}>
                <option value={"default"} disabled hidden>Select a farm</option>
                    {
                        farms.map((farm,index)=>{
                            return <option value={index} key={farm.id} onChange={(e)=>inputChange(e,farm)}>{farm.id}</option>
                        })
                    }
                </select>
            </div>
            {showTable&&
            <div className='container' style={{marginTop:'2rem'}}>
                <table >
                    <thead>
                        <tr>
                            <th>FarmID</th>
                            <th>Total Number Of Trees</th>
                            {/* <th>Total Number Of Images</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{newFarm.id}</td>
                            <td>{newFarm.treesNumber}</td>
                            {/* <td>{newFarm.imagesNumber}</td> */}
                        </tr>
                    </tbody>
                </table>
            </div>
            }
            {
                showTable&&
                <div className='container' style={{marginTop:'2rem'}}>
                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Tree Type</th>
                                    <th>Trees</th>
                                    <th>Survey</th>
                                    <th>Labeler</th>
                                    <th>Progress</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                            newFarm.trees.map((tree,index)=>{
                                const{type,treesNumber,imagesNumber,id}=tree;
                                let labelersNumber=treesLabelers[index];
                                return(
                                    <React.Fragment key={id}>
                                    <tr>
                                        <td>{type}</td>
                                        <td>{treesNumber}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>Progress</td>
                                        <td><button className='action' style={{fontSize:'1.5rem',color:'var(--farm-btn)'}} onClick={(e)=>{labelersNumber=newLabeler(e,index)}}><IoIosPersonAdd/></button></td>
                                    </tr>
                                    {   labelersSurvey&&
                                        [...Array(labelersNumber)].map((e, i) => {
                                            
                                            const assignInput=(event)=>{
                                                const {name,value}=event.target;
                                                const assignArray=[...labelersSurvey];
                                                assignArray[index][i]={...assignArray[index][i],[name]:value}
                                                setLabelersSurvey(assignArray);
                                                console.log(labelersSurvey)
                                            }
                                            
                                            return (
                                                <tr key={i}>
                                                    <td></td>
                                                    <td><input type="number" name={Object.keys(newlabelerSurvey)[2]} value={labelersSurvey[index][i].treesNumber} onChange={assignInput} /></td>
                                                    {/* <td><input type="number" name={Object.keys(newlabelerSurvey)[3]} value={labelersSurvey[index][i].imagesNumber} onChange={assignInput} /></td> */}
                                                    <td>
                                                        <select name={Object.keys(newlabelerSurvey)[1]} id="surveys" onChange={assignInput} defaultValue={"default"}>
                                                        <option value={"default"} disabled hidden>Select survey</option>
                                                            {surveys.map((survey,i)=>{
                                                                return (
                                                                    <option  key={survey.id} value={survey.id}>{survey.id}</option>
                                                                )
                                                            })
                                                            }
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select name={Object.keys(newlabelerSurvey)[0]} id="labelers" onChange={assignInput} defaultValue={"default"}>
                                                        <option value={"default"} disabled hidden>Select Labeler</option>
                                                        {
                                                        labelers.map((labeler,i)=>{
                                                            return <option key={labeler.id} value={labeler.id}>{labeler.id}</option>
                                                        })
                                                        }
                                                        </select>
                                                    </td>
                                                    <td></td>
                                                    <td style={{display:'flex'}}>
                                                        <button className='action success' onClick={()=>assignLabeler(index,i,id)} ><MdOutlineAssignmentTurnedIn/></button>
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
                        <button type='button' onClick={addFarm} style={{display:'block',margin:'2rem auto 0 auto'}} className='btn'>Submit</button>
                        </div>
                </div>
            }
        </div>
        <div className="container">
            <button className='btn' style={{margin:'2rem 0 2rem 0'}} onClick={()=>navigate('/farms')}>All Farms</button>
        </div>
    </div>
  )
}

export default NewFarm
