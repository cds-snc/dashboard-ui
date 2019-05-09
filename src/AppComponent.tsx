/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/core";
import withI18N from "./lib/i18n";
import PageHeader from './widgets/PageHeader';
import Cost from "./Cost";
import Vac from "./Vac";
import System from "./System";
import { Router } from "@reach/router";

interface Props {
  t: Function;
}

const App = (props: Props) => {
  return (
    <React.Fragment>
      <PageHeader t={props.t}/>
      <Router aria-label="main" id="main">
        <Cost path="/" />
        <Cost path="cost/" />
        <Vac path="vac/" />
        <System path="system/" />
      </Router>
    </React.Fragment>
  );
}

export default withI18N(App);
