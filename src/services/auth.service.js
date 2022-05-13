const logout=()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload()
}

const authService={
    logout
}

export default authService