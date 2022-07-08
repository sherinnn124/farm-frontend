import axios from 'axios';
import React from 'react'
import { useState,useContext,useEffect } from 'react'
import { userContext } from '../../App';
import Loader from '../shared/Loader';
import { MdLabelImportant } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip'

function MyTasks() {
  const [myTasks,setMyTasks]=useState(null);
  const user=useContext(userContext);
  const navigate=useNavigate();

  useEffect(()=>{
    if(user){
    axios.get(`labelingTask/findLabelerTask/${user.id}`)
    .then(response=>setMyTasks(response.data.items))
    }
  },[user])

  return (
    <>
    {!myTasks?<Loader/>:
      <div className='container tablecontainer' style={{marginTop:'6rem'}}>
        <table>
          <thead>
            <tr>
              <th>labelerId</th>
              <th>Task Id</th>
              <th>treeDetectionRunId</th>
              <th>Survey Id</th>
              <th>Trees Number</th>
              <th>Trees Images</th>
              <th>Status</th>
              <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
          {myTasks.map((task)=>
            <tr key={task.id}>
              <td>{task.labelerId}</td>
              <td>{task.id}</td>
              <td>{task.treeDetectionRunId}</td>
              <td>{task.surveyId}</td>
              <td>{task.numOfTrees}</td>
              <td>{task.numOfImages}</td>
              <td>{task.status}</td>
              <td >
                <Tooltip title="Start" placement="right" arrow>
                  <button className='action' style={{color:"var(--farm-btn)"}} onClick={()=>navigate("/answerLabelSurvey",{state:{labelingTaskId:task.id,tdRunId:task.treeDetectionRunId,surveyId:task.surveyId,labelerId:task.labelerId}})}>
                    <MdLabelImportant/>
                  </button>
                </Tooltip>
              </td>
            </tr>
            )
          }
          </tbody>
        </table>
      </div>
    }
    </>
  )
}

export default MyTasks
