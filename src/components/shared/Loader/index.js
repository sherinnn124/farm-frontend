import React from 'react'
import { useEffect,useContext} from 'react'
import { navbarContext } from '../../../App'
import './styles.css'
function Loader() {
  const navbar=useContext(navbarContext)
  useEffect(()=>{
    navbar.setNavbarHidden(true);

    return ()=>{navbar.setNavbarHidden(false)}
  })
  return (
  <div className="spinnerContainer">
    <div className="sk-chase">
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
    </div>
  </div>
  )
}

export default Loader
