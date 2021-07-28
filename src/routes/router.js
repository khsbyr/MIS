import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layouts from '../container/Layout/Layouts';
import Admin from '../pages/admin';
import ForgetPassword from '../pages/auth/ForgetPassword';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ResetPassword from '../pages/auth/ResetPassword';
import {
  ADMIN_PAGE,
  FORGET_PASSWORD,
  REGISTER,
  RESET_PASSWORD,
} from '../settings/constantRoutes';

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
