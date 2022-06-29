import axios from 'axios';
import React, { useState } from 'react'
import {useLocation} from 'react-router-dom'
function EditFarm() {
    const {state}=useLocation();
    const[farm,setFarm]=useState(state.farm)
    const updateFarm=()=>{
        const today=new Date();
        const date=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
        farm.updated=date;
                // post data
        // axios.post('',farm)
    }
    const editData=(e)=>{
        const {name,value}=e.target;
        setFarm({...farm,[name]:value})
    }
  return (
    <div>
              <form onSubmit={updateFarm}>
            <h2>{farm.name}</h2>
            <div>
                <label htmlFor="id">Name:</label>
                <input type="text" value={farm.name} name="name" onChange={editData} />
            </div>
            <div>
                <label htmlFor="survies">number of survies:</label>
                <input type="text" value={farm.survies} name="survies" onChange={editData}/>
            </div>
            <div >
                <label htmlFor="labelers">number of labelers:</label>
                <input type="text" value={farm.labelers} name="labelers" onChange={editData}/>
            </div>
            <div >
                <label htmlFor="labels">Enter number of labels:</label>
                <input type="text" value={farm.labels} name="labels" onChange={editData}/>
            </div>
            <div >
                <label htmlFor="progress">Enter latest progress:</label>
                <input type="text" value={farm.progress} name="progress" onChange={editData}/>
            </div>
        </form>
    </div>
  )
}

export default EditFarm
