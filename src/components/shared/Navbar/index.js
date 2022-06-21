import logo from '../../../assets/logo.png';
import { GiHamburgerMenu} from "react-icons/gi";
import { useEffect, useRef, useState} from 'react';
import {NavLink,useNavigate,useLocation} from 'react-router-dom'
import styles from './styles.module.css'
import axios from 'axios';


function Navbar() {
  const[showLinks,setShowLinks]=useState(false)
  const linkContainerRef=useRef(null)
  const linksRef=useRef(null)
  const[logout,setLogout]=useState(false)
  const navigate=useNavigate();
  const location=useLocation();
  const display=()=>{
    setShowLinks(!showLinks)
  }
  useEffect(()=>{
    const height=linksRef.current.getBoundingClientRect().height;
    if(showLinks){linkContainerRef.current.style.height=`${height}px`}
    else{linkContainerRef.current.style.height='0px'}
  },[showLinks])
  const navLinkStyle=({isActive})=>{
      return {
          fontWeight:isActive?'bold':'normal'
      }
  }
  const logoutNow=()=>{
    axios.get("token/logout")
    .then(res=>console.log("success"))
    .catch(e=>console.log('failed'))
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();

  }
  useEffect(()=>{
    if(logout==true){
      axios.get("user/logout")
      .then(res=>{
        console.log(res)
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // navbar.setNavbarHidden(true);
        // window.location.reload();
        // window.location.reload();
        navigate('/login',{state:{path:location.pathname}})
        window.location.reload();
        setLogout(false)
        
        // setLogout(false)
      })
      .catch(e=>console.log('failed'))
    }
  },[logout])

  return (
      <div className={styles.navContainer} >
        <nav className={styles.nav}>
            <div className={styles.navHeader}>
            <div className={styles.imageContainer}>
                <img className={styles.logo} src={logo} alt="logo" />
                <h2>EGROBOTS</h2>
            </div>
            <button className={showLinks?`${styles.toggler} ${styles.rotateBlue}`:`${styles.toggler}`} onClick={display}>
                <GiHamburgerMenu/>
            </button>
            </div>
            <div className={styles.linksContainer} ref={linkContainerRef}>
                <ul className={`${styles.links} ${styles.ul}`} ref={linksRef}>
                    <li className={styles.li}><NavLink style={navLinkStyle} className={styles.a} to="/">Home</NavLink></li>
                    <li className={styles.li}><NavLink style={navLinkStyle} className={styles.a} to="labelers">Labelers</NavLink></li>
                    <li className={styles.li}><NavLink style={navLinkStyle} className={styles.a} to="surveys">Surveys</NavLink></li>
                    <li className={styles.li}><NavLink style={navLinkStyle} className={styles.a} to="farms">Farms</NavLink></li>
                    <li className={styles.li}><NavLink style={navLinkStyle} className={styles.a} to="/login" onClick={()=>setLogout(true)}>Log Out</NavLink></li>

                </ul>
            </div>
        </nav>
      </div>
  );
}

export default Navbar;
