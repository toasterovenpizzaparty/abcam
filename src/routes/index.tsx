import { BrowserRouter as Router, Route } from "react-router-dom";

import { Home, StepPage } from "../pages";

export default () => (
  <Router>
    <Route exact path='/' component={Home} />
    <Route path='/step/:step/id/:id' component={StepPage} />
    <Route path='/step/:step' component={StepPage} />
  </Router>
);
