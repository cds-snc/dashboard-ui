import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Cost from "./Cost";
import Vac from "./Vac";
import * as serviceWorker from "./serviceWorker";
import { Router, Link } from "@reach/router";


const App = () => (
  <div>
    <div className="header">
      <h1>Dashboard</h1>
      <nav>
        <Link to="/">Cost Dashboard</Link>
        &nbsp; | &nbsp;
        <Link to="/vac">VAC Dashboard</Link>
      </nav>
    </div>
    <Router>
      <Cost path="/" />
      <Vac path="/vac" />
    </Router>
  </div>
);


ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
