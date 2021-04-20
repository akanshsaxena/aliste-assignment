import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Dash from "./Dash";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
        </Switch>
        <Switch>
          <Route path="/dashboard" exact>
            <Dash />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
