// react-select functions for styling
const customStyles = {
    option:(provided,state)=>({
        ...provided,
        color:state.isSelected?'white':'black',
        cursor:state.isDisabled?'not-allowed':'pointer',
        backgroundColor:state.isDisabled?'white':state.isSelected?'var(--main-color)':state.isFocused&&'var(--input-border-bottom)'
        
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
};


export {customStyles,customTheme,generateColor}