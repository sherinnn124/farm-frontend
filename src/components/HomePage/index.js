import axios from 'axios'
import React, { useEffect } from 'react'
import { useContext } from 'react'
import { userContext } from '../../App'
function HomePage() {

  const user=useContext(userContext)
  useEffect(()=>{
    console.log(user)
    axios.get('survay')
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
