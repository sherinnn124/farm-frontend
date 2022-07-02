import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState ,useRef} from "react";
import * as Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';


const LabelTwo = ({survey,color,questionIndex,imageData,savedAnno,progress}) => {

  const {image,imageIndex}=imageData;
  const {url,imageId}=image;
  const {labeling,required}=progress.question;
  const chosenOption=survey.chosenOptions[questionIndex];
  const [viewer, setViewer] = useState( null);
  const [anno, setAnno] = useState(null);
  const [colors,setColors]=useState(null);
  

  useEffect(() => {
    if (image && viewer) {
      viewer.open({
        type:"image",
        url:url
      });
    }
  }, [imageIndex,viewer]);

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
        loadTilesWithAjax: true,
        tileRequestHeaders: {
          Authentication: 'Bearer <AUTH_TOKEN>'
        }
        // tileSources: {
        //   type:"image",
        //   url:image,
        //   // Image:{
        //   //   Format: "jpeg",
        //   //   Overlap: 1,
        //   //   Size:{ Height: 32893, Width: 46000 },
        //   //   TileSize: 510,
        //   //   Url: "https://openslide-demo.s3.dualstack.us-east-1.amazonaws.com/aperio/cmu-1-jp2k-33005/slide_files/",
        //   //   xmlns: "http://schemas.microsoft.com/deepzoom/2008"
        //   // }
        // }
      });    
    setViewer(initViewer );
    const config = {
      loadTilesWithAjax: true,
      tileRequestHeaders: {
        Authentication: 'Bearer <AUTH_TOKEN>'
      }
    }; 
    const annotate = Annotorious(initViewer, config);
    annotate.disableEditor=true;
    annotate.formatters = [ ...annotate.formatters, formatter ]
    annotate.disableSelect=false;
    setAnno(annotate);  
  };
// useEffect(()=>{
// if(savedAnno.savedAnnotations[0][imageIndex].length){
//   anno.setAnnotations(savedAnno.savedAnnotations[0][imageIndex])
// }
// },[imageIndex])


const isInitialMount = useRef(true);
useEffect(() => {
  if (isInitialMount.current) {
    isInitialMount.current = false;
  } else {
      anno.off('createSelection');
      anno.off('createAnnotation');
      anno.off('deleteAnnotation');
      anno.off('updateAnnotation');
      anno.off('clickAnnotation');
  }
},[questionIndex,imageIndex,[progress]]);


const formatter=(annotation)=>{
  if(annotation.body[0]){
  return {
    'style':`stroke-width:2; stroke:#${annotation.body[0].color}`
  }
}
}
const checkForProgress=(isdeleted)=>{
  let indicator=[...progress.progressIndicator];
  if(required && labeling){
    if(survey.surveyResult[questionIndex].answer.length){
      if(!progress.progressIndicator[questionIndex] && survey.surveyResult[questionIndex].labels.some((label)=>label.length>0)){
        indicator[questionIndex]=true;
        progress.setProgressIndicator(indicator);
        progress.setCurrentProgress(previous=>previous+1);
      }
      if(isdeleted && !survey.surveyResult[questionIndex].labels.some((label)=>label.length>0)){
        indicator[questionIndex]=false;
        progress.setProgressIndicator(indicator);
        progress.setCurrentProgress(previous=>previous-1);
      }
    }
  }
  if(labeling && !required){
    if(!progress.progressIndicator[questionIndex]){
      indicator[questionIndex]=true;
      progress.setProgressIndicator(indicator);
      progress.setCurrentProgress(previous=>previous+1);
    }
    if(isdeleted && !(survey.surveyResult[questionIndex].labels.some((label)=>label.length>0))){
      indicator[questionIndex]=false;
      progress.setProgressIndicator(indicator);
      progress.setCurrentProgress(previous=>previous-1);
    }
  }
  
}

  useEffect(()=>{
    if(anno){
      // if(savedAnno.savedAnnotations[0][imageIndex].length){
      //   anno.setAnnotations(savedAnno.savedAnnotations[0][imageIndex])
      // }
      anno.on('createSelection', async (selection) => {    
        selection.body = [{
          questionIndex:questionIndex,
          imageIndex:imageIndex,
          color:colors,
          optionId:survey.chosenOptions[questionIndex].answers.id,
          questionIndex:questionIndex
        }];
        await anno.updateSelected(selection);
        anno.saveSelected();
        
        }); 
        anno.on('createAnnotation', function(annotation, overrideId) {
          console.log(annotation);
          const array=[...survey.surveyResult];
          if(!array[questionIndex].labels[imageIndex]){
            array[questionIndex].labels[imageIndex]=[];
          }
          array[questionIndex].labels[imageIndex]=[...array[questionIndex].labels[imageIndex],{id:annotation.id,pixels:annotation.target.selector.value}];
          survey.setSurveyResult(array);
          let arrayTwo=[...savedAnno.savedAnnotations];
          arrayTwo[0][imageIndex]=[...arrayTwo[0][imageIndex],annotation];
          savedAnno.setSavedAnnotations(arrayTwo)
          checkForProgress();
        });  
      anno.on('updateAnnotation', async (annotation, previous) => {
        const array=[...survey.surveyResult];
          for(let i=0;i<array[questionIndex].labels[imageIndex].length;i++){
            if(array[questionIndex].labels[imageIndex][i].id==annotation.id){
                  array[questionIndex].labels[imageIndex][i]={id:annotation.id,pixels:annotation.target.selector.value};
                  survey.setSurveyResult(array);
                  const updatedAnnotations=[...savedAnno.savedAnnotations];
                  updatedAnnotations[0][imageIndex].forEach((element,i) => {
                    if(element.id===annotation.id){
                      updatedAnnotations[0][imageIndex][i]=annotation;
                        savedAnno.setSavedAnnotations(updatedAnnotations)
                    }
                  });
                  break;
            }
          }
      });
      anno.on('mouseEnterAnnotation', function(annotation, element) {
        if(annotation.body[0].questionIndex!==questionIndex){
          anno.disableSelect=true
        }
        else{
          anno.disableSelect=false
        }
      });
      anno.on('deleteAnnotation', async (annotation) => {
        const array=[...survey.surveyResult];
        const newArray=array[questionIndex].labels[imageIndex].filter((label)=>label.id !== annotation.id);
        array[questionIndex].labels[imageIndex]=newArray
        survey.setSurveyResult(array);
        const remainingAnnotations=[...savedAnno.savedAnnotations]
        remainingAnnotations[0][imageIndex]=savedAnno.savedAnnotations[0][imageIndex].filter((anno)=>anno.id!==annotation.id);
        savedAnno.setSavedAnnotations(remainingAnnotations);
        checkForProgress(true);
      });
      anno.on('mouseLeaveAnnotation', function(annotation, element) {
        anno.disableSelect=false
      });
    }
  },[anno,questionIndex,imageIndex,progress,colors,survey.chosenOptions])  


  useEffect(()=>{
    if(anno){
      if(chosenOption.questionType=="radio"){
        if(savedAnno.savedAnnotations[0][imageIndex].length){
          const arrayOne=[...survey.surveyResult];
          console.log(savedAnno.savedAnnotations[0][imageIndex])
          savedAnno.savedAnnotations[0].forEach((image,imageIndex)=>{
            image.forEach((annotation,annotationIndex)=>{
              console.log(annotation)
              if(annotation.body[0].optionId !== chosenOption.answers.id && annotation.body[0].questionIndex==questionIndex){
                anno.removeAnnotation(annotation);
                arrayOne[annotation.body[0].questionIndex].labels[imageIndex]=
                arrayOne[annotation.body[0].questionIndex].labels[imageIndex].filter((label)=>annotation.id !== label.id);
              }
            })
          })
          // savedAnno.savedAnnotations[0][imageIndex].forEach((annotation)=>{
          //   console.log(annotation.body[0].optionId,chosenOption.answers.id,annotation.body[0].questionIndex,questionIndex)
          //   if(annotation.body[0].optionId !== chosenOption.answers.id && annotation.body[0].questionIndex==questionIndex){
          //     anno.removeAnnotation(annotation);
          //     arrayOne[questionIndex].labels[imageIndex]=arrayOne[questionIndex].labels[imageIndex].filter((label)=>label.id !== annotation.id)
          //   }
          // })
          console.log(arrayOne)
          survey.setSurveyResult(arrayOne)
          const array=[...savedAnno.savedAnnotations]
          array[0][imageIndex]=array[0][imageIndex].filter((annotation)=>annotation.body[0].optionId==chosenOption.answers.id || annotation.body[0].questionIndex!=questionIndex);
          savedAnno.setSavedAnnotations(array)
        }
      }
  }
  },[questionIndex,anno,survey.chosenOptions])

  useEffect(()=>{
    if(anno){
      if(chosenOption.answers.requireLabelingFlg){
        setColors(chosenOption.answers.optionColor)
        }
        else{
          anno.off('createSelection');
          anno.off('createAnnotation');
        }
    }
  },[savedAnno.savedAnnotations,anno,survey.chosenOptions,imageIndex])
  
  const isInitialMountTwo = useRef(true);
  useEffect(()=>{
    if (isInitialMountTwo.current) {
      isInitialMountTwo.current = false;
    }
    else{
      if(savedAnno.savedAnnotations[0][imageIndex].length){
        anno.setAnnotations(savedAnno.savedAnnotations[0][imageIndex])
      }
    }
  },[imageIndex,anno])

  useEffect(() => {   
    InitOpenseadragon();
    return () => {
        viewer && viewer.destroy(); 
    }; 
  }, [imageIndex]);

  return (
        <div id="openSeaDragon"style={{height: "800px",width: "800px"}}></div>   
  );
};

export {LabelTwo} ; 