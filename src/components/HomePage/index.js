import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { userContext } from '../../App'

function HomePage() {
  const[survays,setSurvays]=useState([]);
  const[farms,setFarms]=useState([])
  const user=useContext(userContext)


  return (
    <>
      Home page
    </>
  )
}

export default HomePage
