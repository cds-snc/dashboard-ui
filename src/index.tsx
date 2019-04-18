/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from "react";
import { hydrate, render } from "react-dom";
import CdsLogo from './CdsLogo';
// import "./index.css";
import Cost from "./Cost";
import Vac from "./Vac";
import Home from "./Home";
import * as serviceWorker from "./serviceWorker";
import { Router, Link } from "@reach/router";

const header = css`
  background: #171717;
  padding: 2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    width: 4rem;
  }

  h1 {
    color: white;
    margin: 0;
    line-height: 1.2rem;
    margin-bottom: 1.4rem;
  }
`

const pageStyles = css`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const navStyle = css`
  color: white;

  a{ 
    color: white;
  }
`;


const App = () => (
  <div css={pageStyles}>
    <div css={header}>
      <div>
        <h1>Loon Dashboard UI (alpha banner)</h1>
        <nav css={navStyle}>
        <Link to="/">Home</Link>
          &nbsp; | &nbsp;
          <Link to="cost">Cost Dashboard</Link>
          &nbsp; | &nbsp;
          <Link to="vac">VAC Dashboard</Link>
        </nav>
      </div>
      <div>
        <CdsLogo />
      </div>
    </div>
    <Router>
      <Home path="/" />
      <Cost path="cost" />
      <Vac path="vac" />
    </Router>
  </div>
);

// ReactDOM.render(<App />, document.getElementById("root"));
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
