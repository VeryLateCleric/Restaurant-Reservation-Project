import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";
import { CreateReservation } from "./reservations/CreateReservation";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Switch>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/">
        <Layout />
      </Route>
    </Switch>
  );
}

export default App;
