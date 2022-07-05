import React from 'react'
import { useEffect } from 'react';
import { useState,useContext } from 'react'
import { userContext } from '../../App';

function MyTasks() {
  const [myTasks,setMyTasks]=useState(null);
  const user=useContext(userContext);
  const [userId,setUserId]=useState(null);
  console.log(userId)


  useEffect(()=>{
    if(user){
    setUserId(user.id)
    }
  },[user])

  return (
    <div className='container' style={{marginTop:'6rem'}}>
      <table>
        <thead>
          <tr>
            <th>Task Id</th>
            <th>treeDetectionRunId</th>
            <th>Survey Id</th>
            <th>Trees Number</th>
            <th>Trees Images</th>
            <th>Status</th>
            <th>treeDetectionRunId</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default MyTasks
