import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import { ADMIN_PAGE, LOGIN_PAGE, REGISTER } from "../settings/constantRoutes";
import Layouts from "../container/Layout/Layouts";

/**
 *
 * Public Routes
 *
 */

const Loading = () => null;
const routes = [
  {
    path: LOGIN_PAGE,
    component: Loadable({
      loader: () =>
        import(/* webpackChunkName: "Home" */ "../pages/auth/login"),
      loading: Loading,
      modules: ["Home"],
    }),
    exact: true,
  },
  {
    path: REGISTER,
    component: Loadable({
      loader: () =>
        import(/* webpackChunkName: "Home" */ "../pages/auth/Register"),
      loading: Loading,
      modules: ["Register"],
    }),
  },
  {
    path: ADMIN_PAGE,
    component: Loadable({
      loader: () =>
        import(/* webpackChunkName: "Home" */ "../pages/admin"),
      loading: Loading,
      modules: ["admin"],
    }),
  },
];

/**
 *
 * Overall Router Component
 *
 */

class Routes extends Component {
  render() {
    return (
        <Layouts>
        <Switch>
          {routes.map(({ path, component, exact = false }) => (
            <Route key={path} path={path} exact={exact} component={component} />
          ))}
        </Switch>
        </Layouts>
    );
  }
}

export default Routes;

