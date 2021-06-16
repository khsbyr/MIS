import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Layout as LayoutWrapper } from "antd";
import Headers from "./Header/Header";
import Pageheader from "./component/Pageheader";


const { Content } = LayoutWrapper;

export default withRouter(function Layout({ children }) {
  return (
    <Fragment>
      <Headers />
      {/* <Pageheader /> */}
      {/* {routes.map(({ path, component, exact = false }) => (
            <Route key={path} path={path} exact={exact} component={component} />
          ))} */}
      <Content>{children}</Content>
    </Fragment>
  );
});
