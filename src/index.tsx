/** @jsx jsx */ jsx;
import { jsx, css } from "@emotion/core";
import React from "react";
import { hydrate, render } from "react-dom";
import PageHeader from './widgets/PageHeader';
import "./index.css";
import Cost from "./Cost";
import Vac from "./Vac";
import Home from "./Home";
import * as serviceWorker from "./serviceWorker";

import { Router } from "@reach/router";

const App = () => (
  <div>
    <PageHeader />
    <Router>
      <Home path="/" />
      <Cost path="cost/" />
      <Vac path="vac/" />
    </Router>
  </div>
);

const rootElement = document.getElementById("root");
if (rootElement && rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
