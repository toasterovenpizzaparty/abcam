import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const StepPage = React.lazy(() => import("../pages/step/step"));

const Routes = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path='/' component={StepPage} />
        <Route path='/step/:step/id/:id' component={StepPage} />
      </Switch>
    </Suspense>
  </Router>
);
export default Routes;
