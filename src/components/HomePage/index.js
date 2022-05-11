import axios from 'axios'
import React, { useEffect } from 'react'
import { useContext } from 'react'
import { userContext } from '../../App'
function HomePage() {

  const user=useContext(userContext)
  useEffect(()=>{
    const config={
      headers:{
        Authorization:'Bearer ' + localStorage.getItem('token')
      }
    }
    console.log(user)
    axios.get('survay',config)
    .then(res=>console.log(res))
    .catch(e=>console.log(e))
  },[])

  return (
    <div>
      <input type="text" />
    </div>
  )
}

export default HomePage
