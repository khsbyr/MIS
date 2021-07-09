import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { ADMIN_PAGE, REGISTER } from "../settings/constantRoutes";
import Layouts from "../container/Layout/Layouts";
import Login from "../pages/auth/login";
import Admin from "../pages/admin";
import Register from "../pages/auth/Register";

class Routes extends Component {
  render() {
    return (
        <Layouts>
        <Switch>
          <Route path={REGISTER} component={Register} />
          <Route path={ADMIN_PAGE} component={Admin} />
          <Route path="/" component={Login} />
        </Switch>
        </Layouts>
    );
  }
}

export default Routes;

