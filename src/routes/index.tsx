import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Home, StepPage } from "../pages";

export default () => (
  <Router>
    <Switch>
      <Route exact path='/' component={StepPage} />
      <Route path='/step/:step/id/:id' component={StepPage} />
    </Switch>
  </Router>
);
