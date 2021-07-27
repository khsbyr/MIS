import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  ADMIN_PAGE,
  REGISTER,
  FORGET_PASSWORD,
  RESET_PASSWORD,
} from '../settings/constantRoutes';
import Layouts from '../layout/layouts';
import Login from '../pages/auth/Login';
import ForgetPassword from '../pages/auth/ForgetPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Admin from '../layout/admin';
import Register from '../pages/auth/Register';

export default function Routes() {
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
