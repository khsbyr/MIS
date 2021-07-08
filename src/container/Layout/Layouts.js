import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Layout as LayoutWrapper } from "antd";
import Headers from "./Header/Header";

const { Content } = LayoutWrapper;

export default withRouter(function Layout({ children }) {
  return (
    <Fragment>
      <Headers />
      <Content>{children}</Content>
    </Fragment>
  );
});
