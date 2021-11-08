import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  LOGIN_PAGE,
  FORGET_PASSWORD,
  REGISTER,
  RESET_PASSWORD,
} from '../settings/constantRoutes';
import Layouts from '../layout/layouts';
import Login from '../pages/auth/Login';
import ForgetPassword from '../pages/auth/ForgetPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Admin from '../layout/admin';
import Register from '../pages/auth/Register';
import ExportIndicators from '../pages/criteria/export/exportIndicator';
import Example from '../pages/training/export';
import ExportButton from '../pages/export/exportButton';
import ExportButtonReport from '../pages/export/exportButtonReport';
import ExportUser from '../pages/exportExcel/excelUser';
import ExportTraining from '../pages/exportExcel/exportTraining';
import ExportFeedback from '../pages/exportExcel/exportFeedback';
import ExportOrganization from '../pages/exportExcel/exportOrganization';

export default function Routes() {
  return (
    <Layouts>
      <Switch>
        <Route path={REGISTER} component={Register} />
        <Route path={FORGET_PASSWORD} component={ForgetPassword} />
        <Route path={RESET_PASSWORD} component={ResetPassword} />
        <Route path={LOGIN_PAGE} component={Login} />
        <Route path="/exportPlan" component={ExportButton} />
        <Route path="/exportReport" component={ExportButtonReport} />
        <Route path="/exportTraining" component={Example} />
        <Route path="/exportIndicators" component={ExportIndicators} />
        <Route path="/exportUser" component={ExportUser} />
        <Route path="/exportTrainingList" component={ExportTraining} />
        <Route path="/exportFeedback" component={ExportFeedback} />
        <Route path="/exportOrganization" component={ExportOrganization} />
        <Route path="/" component={Admin} />
      </Switch>
    </Layouts>
  );
}
