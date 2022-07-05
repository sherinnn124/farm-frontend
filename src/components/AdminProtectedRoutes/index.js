import {Outlet} from "react-router-dom"
import MyTasks from "../MyTasks"

function AdminProtectedRoutes({user}) {
  return (
    user&&user.roles[0].name=="Admin"?<Outlet/>:<MyTasks/>
  )
}

export default AdminProtectedRoutes
