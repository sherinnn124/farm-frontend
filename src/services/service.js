const logout=()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
    
}
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


export {logout,updated,customStyles,customTheme}