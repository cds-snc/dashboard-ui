/** @jsx jsx */
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
    <div>
      <PageHeader t={props.t}/>
      <Router>
        <Cost path="/" />
        <Cost path="cost/" />
        <Vac path="vac/" />
        <System path="system/" />
      </Router>
    </div>
  );
}

export default withI18N(App);
