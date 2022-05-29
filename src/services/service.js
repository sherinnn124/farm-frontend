const logout=()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload()
}
const updated=()=>{
    const today=new Date();
    const date=`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;

    return date
}



export {logout,updated}