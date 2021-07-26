import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import {
  ADMIN_PAGE,
  REGISTER,
  FORGET_PASSWORD,
  RESET_PASSWORD,
} from '../settings/constantRoutes';
import Layouts from '../container/Layout/Layouts';
import Login from '../pages/auth/Login';
import ForgetPassword from '../pages/auth/ForgetPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Admin from '../pages/admin';
import Register from '../pages/auth/Register';

export default function Routes() {
  // const { initialized } = useKeycloak();
  // if (!initialized) {
  //   return <div>Түр хүлээнэ үү!</div>;
  // }
  return (
    <Layouts>
      <Switch>
        <Route path={REGISTER} component={Register} />
        <Route path={FORGET_PASSWORD} component={ForgetPassword} />
        <Route path={RESET_PASSWORD} component={ResetPassword} />
        <Route path={ADMIN_PAGE} component={Admin} />
        <Route path="/" component={Login} />
      </Switch>
    </Layouts>
  );
}
