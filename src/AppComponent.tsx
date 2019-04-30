/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import withI18N from "./lib/i18n";
import PageHeader from './widgets/PageHeader';
import Cost from "./Cost";
import Vac from "./Vac";
import Home from "./Home";
import { Router } from "@reach/router";

interface Props {
  t: Function;
}

const App = (props: Props) => (
  <div>
    <PageHeader t={props.t}/>
    <Router>
      <Home path="/" />
      <Cost path="cost/" />
      <Vac path="vac/" />
    </Router>
  </div>
);

export default withI18N(App);
