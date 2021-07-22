import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Template from './pages/template';
import Diagrams from './pages/diagrams';
import Workspace from './pages/workspace';

const element = (
  <BrowserRouter>
    <Switch>
      <Route exact path={['/', '/template']}>
        <Template />
      </Route>
      <Route path="/diagrams">
        <Diagrams />
      </Route>
      <Route path="/workspace">
        <Workspace />
      </Route>
    </Switch>
  </BrowserRouter>
);

render(
  element,
  document.getElementById('app'),
);
