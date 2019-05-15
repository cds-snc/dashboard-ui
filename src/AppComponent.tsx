/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/core";
import withI18N from "./lib/i18n";
import PageHeader from './widgets/PageHeader';
import Cost from "./Cost";
import Vac from "./Vac";
import System from "./System";
import { Router } from "@reach/router";
import SecurityPerformance from "./SecurityPerformance";

interface Props {
  t: Function;
}

const App = (props: Props) => {
  return (
    <React.Fragment>
      <PageHeader t={props.t}/>
      <Router aria-label="main">
        <Cost path="/" />
        <Cost path="cost/" />
        <SecurityPerformance path="security-performance/" />
        <System path="system/" />
        <Vac path="vac/" />
      </Router>
    </React.Fragment>
  );
}

export default withI18N(App);
