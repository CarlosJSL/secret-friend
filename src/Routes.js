import React from 'react'

import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import Home from './Home/Home';

export const Routes = (props) => {
  return (
    <Router>
      <Switch>
        {/* <PrivateRoute
          path="/home"
          component={Home}
          authenticated={props.auth.allowed}
        /> */}
        <Route
          exact
          path="/"
          component={Home}
        />
      </Switch>
    </Router>
  )
}