import React, { useEffect } from 'react'
import notfound from '../../assets/notfound.svg' 
import styles from './styles.module.css'


function NotFound({navbar}) {
  useEffect(()=>{
    navbar.setNavbarHidden(true);

    return ()=>{navbar.setNavbarHidden(false)}
  })
  return (
    <div className={styles.container}>
      <img src={notfound} alt="not found" className={styles.notFound} />
    </div>
  )
}

export default NotFound
