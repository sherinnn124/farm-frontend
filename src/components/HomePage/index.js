import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { userContext } from '../../App'

function HomePage() {
  const[survays,setSurvays]=useState([]);
  const[farms,setFarms]=useState([])
  const user=useContext(userContext)

  useEffect(()=>{
    console.log(user)
  axios.get('survay')
    .then((res)=>{
      console.log(res)
      setSurvays(res.data.items);
      console.log(survays)
    })
    .catch(
      e=>console.log(e)
    )
    
  },[user])
  useEffect(()=>{
    axios.get('farm')
    .then(res=>{
      console.log(res)
      setFarms(res.data.items)
    })
    .catch(e=>console.log(e))
  },[user])

  return (
    <>
      {survays.map((survay)=>{
        return(
          <div key={survay.id}>
            <p>{survay.id}</p>
            <p>{survay.title}</p>
          </div>
        )}
      )}

      {
        farms.map((farm)=>{
          return(
            <div key={farm.id}>
              <p>{farm.id}</p>
              <p>{farm.farmId}</p>
              <p>{farm.Desc}</p>
            </div>
          )
        })
      }
    </>
  )
}

export default HomePage
