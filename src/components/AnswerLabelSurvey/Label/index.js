import React from 'react'
import { Annotorious } from '@recogito/annotorious';
import '@recogito/annotorious/dist/annotorious.min.css';
import {useRef,useState,useEffect} from 'react'
import styles from './styles.module.css'
import {MdOutlineNavigateNext,MdOutlineNavigateBefore} from 'react-icons/md'
function Label() {
const imgEl = useRef();
const [ anno, setAnno ] = useState();
const [ tool, setTool ] = useState('rect');
const[treeImages,setTreeImages]=useState(['treeOne.jpg','treeTwo.jpg'])
const [imageIndex,setImageIndex]=useState(1)
// Init Annotorious when the component
// mounts, and keep the current 'anno'
// instance in the application state
useEffect(() => {
  let annotorious = null;

  if (imgEl.current) {
    // Init
    annotorious = new Annotorious({
      image: imgEl.current,
      disableEditor: true
    });

    // Attach event handlers here
    annotorious.on('createSelection', async (selection) => {
      selection.body = [{
      type: 'TextualBody',
      purpose: 'tagging',
      value: 'tag sherin'
    }];
    await annotorious.updateSelected(selection);
    annotorious.saveSelected();
    console.log(selection)
    });
    annotorious.on('selectAnnotation', function(selection) {
      // The users has selected an existing annotation
      console.log("selected")
      console.log(selection)
    });
    annotorious.on('updateAnnotation', (annotation, previous) => {
      console.log('updated', annotation, previous);
    });
    annotorious.on('updateAnnotation',(selection)=>{
      console.log(selection)
    })
    annotorious.on('deleteAnnotation', annotation => {
      console.log('deleted', annotation);
    });
  }

  // Keep current Annotorious instance in state
  setAnno(annotorious);

  // Cleanup: destroy current instance
  return () => annotorious.destroy();
}, []);
// Toggles current tool + button label
const toggleTool = () => {
  if (tool === 'rect') {
    setTool('polygon');
    anno.setDrawingTool('polygon');
  } else {
    setTool('rect');
    anno.setDrawingTool('rect');
  }
}
const changeIndex=(index)=>{
  if(index>treeImages.length-1)return 0
  if(index<0)return treeImages.length-1
  return index
}
document.addEventListener("keydown",(e)=>{
  if(e.code=='ArrowRight'){setImageIndex(changeIndex(imageIndex+1))}
  else if(e.code=="ArrowLeft"){setImageIndex(changeIndex(imageIndex-1))}
})
return (
  <div style={{width:(window.innerWidth)*3/4}} className={styles.labelContainer}>
    <div>
      <button className={styles.navImages} onClick={()=>setImageIndex(changeIndex(imageIndex+1))}><MdOutlineNavigateBefore/></button>
      <button className={styles.navImages} onClick={()=>setImageIndex(changeIndex(imageIndex-1))}><MdOutlineNavigateNext/></button>
    </div>
    <div style={{position:'relative'}}>

      <img
        ref={imgEl}
        src={require(`./palm/${treeImages[imageIndex]}`)}
        alt="Hallstatt Town Square"
      />
    </div>
    <div>
      <button
        onClick={toggleTool}>
          { tool === 'rect' ? 'RECTANGLE' : 'POLYGON' }
      </button>
    </div>
  </div>
);
}

export default Label
