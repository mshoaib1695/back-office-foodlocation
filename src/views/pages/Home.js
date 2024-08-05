import React, {lazy} from "react"
import { BrowserRouter as Router,  Route, Switch } from 'react-router-dom'
import RRR from '../../app_components/Roles/Roles'
const Users = lazy(() =>
  import("../../app_components/Users/Users")
)
const UpdateUser = lazy(() =>
  import("../../app_components/Users/UpdateUser")
)
const CreateUser = lazy(() =>
  import("../../app_components/Users/CreateUser")
)
const Roles = lazy(() =>
  import("../../app_components/Roles/Roles")
)
const UpdateRole = lazy(() =>
  import("../../app_components/Roles/UpdateRole")
)
const CreateRole = lazy(() =>
  import("../../app_components/Roles/CreateRole")
)
function Home(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/dashboard" render={() => <></>}></Route>
        <Route  path="/dashboard/usersetup" render={() => <Users />}></Route>
        <Route  path="/dashboard/updateuser" render={() => <UpdateUser />}></Route>
        <Route  path="/dashboard/rolesetup" render={() => <RRR />}></Route>
        <Route  path="/dashboard/createuser" render={() => <CreateUser />}></Route>
        <Route  path="/dashboard/updaterole" render={() => <UpdateRole />}></Route>
        <Route  path="/dashboard/createrole" render={() => <CreateRole />}></Route>
      </Switch>
    </Router>
  )
}

export default Home