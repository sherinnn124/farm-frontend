const updated=()=>{
    const today=new Date();
    const date=`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;

    return date
}
// react-select functions for styling

const customStyles = {
    option:(provided,state)=>({
        ...provided,
        color:state.isSelected?'white':'black',
    })
}
const customTheme=(theme)=>{
    return {
        ...theme,
        colors:{
            ...theme.colors,
            primary:'var(--main-color)',
            primary25:'var(--input-border-bottom)'
        }
    }
}

const generateColor = () =>{
    let color = Math.random().toString(16).substr(-6);
    return color
  //   let newColors=[];
  //   for(let i=0;i<survey.surveyResult.length;i++){
  //     colors.push(Math.random().toString(16).substr(-6))
  //   }
  // setColors(newColors)
};


export {updated,customStyles,customTheme,generateColor}