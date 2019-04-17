/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Cost from "./Cost";
import * as serviceWorker from "./serviceWorker";
import { Router, Link } from "@reach/router";

const header = css`
  margin-left: 10px;
`
const navStyle = css`
  margin-bottom: 20px;
`;

const App = () => (
  <div>
    <div css={header}>
      <h1>Dashboard</h1>
      <nav css={navStyle}>
        <Link to="/">Cost Dashboard</Link>
      </nav>
    </div>
    <Router>
      <Cost path="/" />
    </Router>
  </div>
);


ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
