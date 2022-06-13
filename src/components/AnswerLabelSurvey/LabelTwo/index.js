import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState ,useRef} from "react";
import * as Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
const LabelTwo = ({survey,color,questionIndex,imageData,questionsNumber}) => {


  const {image,imageIndex}=imageData;
  const [viewer, setViewer] = useState( null);
  const [anno, setAnno] = useState(null);
  const imagesNumber=2;
  const [annotations,setAnnotations]=useState(new Array(questionsNumber).fill([]).map(()=>new Array(imagesNumber).fill([])));


  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    const initViewer = OpenSeaDragon({
        id: "openSeaDragon",
        prefixUrl: "/openseadragon-images/",
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2,
        tileSources: {
          type: "image",
          url: image
        }
      });    
    setViewer(initViewer );
    const config = {}; 
    const annotate = Annotorious(initViewer, config);
    annotate.disableEditor=true;
    annotate.formatters = [ ...annotate.formatters, formatter ]
    annotate.disableSelect=false;
    // annotate.setDrawingEnabled(true);
    setAnno(annotate);  
  };
// useEffect(()=>{
// if(annotations[questionIndex][imageIndex].length){
//   const newAnn=annotations[questionIndex][imageIndex];
//   anno.setAnnotations(newAnn)
// }
// },[image])


const isInitialMount = useRef(true);
useEffect(() => {
  if (isInitialMount.current) {
     isInitialMount.current = false;
  } else {
      anno.off('createSelection');
      anno.off('createAnnotation');
      anno.off('deleteAnnotation');
      anno.off('updateAnnotation');
      // anno.formatters= [ ...anno.formatters, formatter ];
      anno.off('clickAnnotation');
  }
},[questionIndex,imageIndex]);


const formatter=(annotation)=>{
  if(annotation.body[0]){
  return {
    'style':`stroke-width:2; stroke:#${annotation.body[0].color}`
  }
}
}


  useEffect(()=>{
    if(anno){
      anno.on('createSelection', async (selection) => {    
        selection.body = [{
          questionIndex:questionIndex,
          imageIndex:imageIndex,
          color:color
        }];
        await anno.updateSelected(selection);
        anno.saveSelected();
        
        }); 
        anno.on('createAnnotation', function(annotation, overrideId) {
          console.log(annotation)
          const array=[...survey.surveyResult];
          if(!array[questionIndex].labels[imageIndex]){
            array[questionIndex].labels[imageIndex]=[];
          }
          array[questionIndex].labels[imageIndex]=[...array[questionIndex].labels[imageIndex],{id:annotation.id,pixels:annotation.target.selector.value}];
          survey.setSurveyResult(array);
          const arrayTwo=[...annotations];
          arrayTwo[questionIndex][imageIndex]=[...arrayTwo[questionIndex][imageIndex],annotation];
          setAnnotations(arrayTwo);
          console.log(anno.getAnnotations())
        });  
      anno.on('updateAnnotation', async (annotation, previous) => {
        console.log(annotation)
        const array=[...survey.surveyResult];
        for (let i=0;i<array.length;i++){
          for(let j=0;j<array[i].labels.length;j++){
            if(array[i].labels[j].id==annotation.id){
                  array[i].labels[j]={id:annotation.id,pixels:annotation.target.selector.value};
                  survey.setSurveyResult(array)
                  break;
                }
          }
        }
      });
      anno.on('mouseEnterAnnotation', function(annotation, element) {
        // anno.setDrawingEnabled(false);
        if(annotation.body[0].questionIndex!==questionIndex){
          anno.disableSelect=true
        }
        else{
          anno.disableSelect=false
        }
      });
      anno.on('deleteAnnotation', async (annotation) => {
        console.log("deleted") 
        const array=[...survey.surveyResult];
        for(let i=0;i<array.length;i++){
          const newArray=array[i].labels.filter((label)=>label.id !== annotation.id);
          array[i].labels=newArray;
        }
        survey.setSurveyResult(array);
      });
      anno.on('mouseLeaveAnnotation', function(annotation, element) {
        // anno.setDrawingEnabled(true);
      });
    }
  },[anno,questionIndex,imageIndex])  
  

  useEffect(() => {
    if (image && anno && annotations[questionIndex][imageIndex].length){         //  these
      const newAnn=annotations[questionIndex][imageIndex];
      console.log(newAnn)
      anno.setAnnotations(newAnn)      //  are the updated
      console.log(anno)
    }       
    InitOpenseadragon();
    return () => {
        viewer && viewer.destroy(); 
    }; 
  }, [imageIndex]);


  // useEffect(() => {
  //   if (image && viewer) {
  //     viewer.open(image.source);
  //   }
  //   if (image && anno && annotations[questionIndex][imageIndex].length){         //  these
  //     console.log("m")
  //     const newAnn=annotations[questionIndex][imageIndex];
  //     console.log(newAnn)
  //     anno.setAnnotations(newAnn)      //  are the updated
  //     console.log(anno)
  //   }                           //  lines
  // }, [image]);

  
  return (
        <div id="openSeaDragon"style={{height: "800px",width: "800px"}}></div>   
  );
};

export {LabelTwo} ; 
