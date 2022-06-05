import React from 'react'
import Label from './Label'
import Answer from './Answer'
import styles from './styles.module.css'
function AnswerLabelSurvey() {
  return (
    <div className={styles.container}>
      <Answer/>
      <Label/>
    </div>
  )
}

export default AnswerLabelSurvey
