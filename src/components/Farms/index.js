import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom';
import data from './data'
import axios from 'axios';
import { FaEdit,FaTrash} from "react-icons/fa";

function Farms() {
    //data should come from backend
    const[farmsData,setFarmsData]=useState(data);
    const navigate=useNavigate();
    

    const newFarm=()=>{
        let number;
        if(farmsData.length!=0){number=farmsData[farmsData.length-1].id+1;}
        else{number=1}
        const today=new Date();
        const date=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
        const farm={
            id:number,
            name:`farm${number}`,
            labelers:"",
            labels:"",
            progress:"",
            survies:"",
            updated:date
        }
        setFarmsData([...farmsData,farm])
        // posting new farm
    }
    const removeFarm=(id)=>{
        setFarmsData((previousFarms)=>previousFarms.filter((farm)=>farm.id!=id));
        // delete route
    }
    //API call to fetch farm data-->
    // useEffect(()=>{
    //     axios.get()
    //     .then(res=>setFarmsData(res.data))
    //     .catch(e=>console.log(e))
    // })

  return (
    <div className='container'>
        <div className='btnContainer'>
            <button className='btn' onClick={()=>navigate('newFarm')} style={{marginTop:'2rem'}}>+New Farm</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Survies</th>
                    <th>Labelers</th>
                    <th>Updated</th>
                    <th>Labels</th>
                    <th>progress</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {farmsData.length==0?
            <tr><td colSpan="8">No Farms Yet</td></tr>:
                farmsData.map((farm)=>{
                    return(
                    <tr key={farm.id}>
                        <td>{farm.id}</td>
                        <td>{farm.name}</td>
                        <td>{farm.survies}</td>
                        <td>{farm.labelers}</td>
                        <td>{farm.updated}</td>
                        <td>{farm.labels}</td>
                        <td>{farm.progress}</td>
                        <td style={{display:"flex"}}>
                            <button className='edit action' style={{fontSize:'1rem'}} onClick={()=>navigate(`edit/${farm.id}`,{state:{farm:farm}})}><FaEdit/></button>
                            <button className='remove action' style={{fontSize:'1rem'}} onClick={()=>removeFarm(farm.id)}><FaTrash/></button>
                        </td>
                    </tr>
                    )
                })
            }
            </tbody>
        </table>
    </div>
  )
}

export default Farms
