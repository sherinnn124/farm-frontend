import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState ,useRef} from "react";
import * as Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';


const LabelTwo = ({survey,questionIndex,imageData,savedAnno,progress,labelData}) => {

  const {imageUrl,imageIndex}=imageData;
  const mandatoryFlg=progress.mandatoryFlg;
  const chosenOption=survey.chosenOptions[questionIndex];
  const [viewer, setViewer] = useState( null);
  const [anno, setAnno] = useState(null);
  const [colors,setColors]=useState(null);
  const {surveyId,questionId,imageId,farmId,treeId,visitId,labelerId,labelingTaskId,tdRunId}=labelData;


  useEffect(() => {
    if (imageUrl && viewer) {
      viewer.open({
        type:"image",
        url:imageUrl
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
const checkForProgress=(isDeleted)=>{
  let progressedBefore=[...progress.progressIndicator];
  if(chosenOption.questionType=="radio"){
    if(!progressedBefore[questionIndex]){
      progressedBefore[questionIndex]=true;
      progress.setProgressIndicator(progressedBefore);
      progress.setCurrentProgress(previous=>previous+1);
    }
    else if(progressedBefore[questionIndex] && isDeleted && !survey.surveyResult[questionIndex].labels.length){
      progressedBefore[questionIndex]=false;
      progress.setProgressIndicator(progressedBefore);
      progress.setCurrentProgress(previous=>previous-1);
    }
  }
}


  useEffect(()=>{
    if(anno){
      anno.on('createSelection', async (selection) => {
        selection.body = [{
          color:colors,
          optionId:survey.chosenOptions[questionIndex].answers.id,
          questionIndex:questionIndex,
        }];
        await anno.updateSelected(selection);
        anno.saveSelected();

        });


        anno.on('createAnnotation', function(annotation, overrideId) {
          const array=[...survey.surveyResult];
          const annotationDetails=(annotation.target.selector.value).replace("xywh=pixel:","").split(",").map(parseFloat);
          const [x,y,xdest,ydest]=annotationDetails;
          const answerOptionId=annotation.body[0].optionId;
          array[questionIndex].labels=[...array[questionIndex].labels,{labelId:annotation.id,x,y,xdest,ydest,surveyId,questionId,imageId,answerOptionId,farmId,visitId,treeId,reviewerId:1,labelerId,tdRunId,labelingTaskId}];
          survey.setSurveyResult(array);
          let arrayTwo=[...savedAnno.savedAnnotations];
          arrayTwo[0][imageIndex]=[...arrayTwo[0][imageIndex],annotation];
          savedAnno.setSavedAnnotations(arrayTwo)
          checkForProgress();
        });


      anno.on('updateAnnotation', async (annotation, previous) => {
        const array=[...survey.surveyResult];
          for(let i=0;i<array[questionIndex].labels.length;i++){
            if(array[questionIndex].labels[i].labelId==annotation.id){
              const annotationDetails=(annotation.target.selector.value).replace("xywh=pixel:","").split(",").map(parseFloat);
              const [x,y,xdest,ydest]=annotationDetails;
              const answerOptionId=annotation.body[0].optionId;
              array[questionIndex].labels[i]={labelId:annotation.id,x,y,xdest,ydest,surveyId,questionId,imageId,answerOptionId,farmId,visitId,treeId,reviewerId:1,labelerId,tdRunId,labelingTaskId};
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
        const newArray=array[questionIndex].labels.filter((label)=>label.labelId !== annotation.id);
        array[questionIndex].labels=newArray
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
          savedAnno.savedAnnotations[0].forEach((image)=>{
            image.forEach((annotation)=>{
              if(annotation.body[0].optionId !== chosenOption.answers.id && annotation.body[0].questionIndex==questionIndex){
                anno.removeAnnotation(annotation);
                arrayOne[annotation.body[0].questionIndex].labels=
                arrayOne[annotation.body[0].questionIndex].labels.filter((label)=>annotation.id !== label.labelId);
              }
            })
          })
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
  },[savedAnno.savedAnnotations,anno,survey.chosenOptions,imageIndex,questionIndex])

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
        <div id="openSeaDragon"style={{height:"100%",width:"100%"}}></div>
  );
};

export {LabelTwo} ;