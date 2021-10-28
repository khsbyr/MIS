import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout as LayoutWrapper } from 'antd';
// import Headers from './header';

const { Content } = LayoutWrapper;

export default withRouter(({ children }) => (
  <>
    {/* <Headers /> */}
    <Content>{children}</Content>
  </>
));
