import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import ErrorBoundary from './components/error/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </Router>
    </ErrorBoundary>
  );
}

export default App;