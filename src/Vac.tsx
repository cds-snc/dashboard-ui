import React from "react";
import { RouteComponentProps } from '@reach/router';
import Deploys from "./widgets/Deploys.js";
import ResearchActivity from "./widgets/ResearchActivity.js";
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import Empty from "./widgets/Empty";
import withI18N from "./lib/i18n";
import Uptime from "./widgets/Uptime";

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

interface VacPageProps extends RouteComponentProps {
  t: Function;
}

class Vac extends React.Component<VacPageProps> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: VacPageProps) {
    super(props);

    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  render(): JSX.Element {
    const { t } = this.props;
    document.title = t("vac_dashboard");

    return (
      <div className="Cost">
        <Grid
          height="100vh"
          areas={["a b", "c d", "e f"]}
          columns="2"
          gap="0px"
        >
          <Deploys socket={this.socket} area="a" t={t} />
          <Uptime socket={this.socket} area="b" t={t} />
          <ResearchActivity id="area-c" socket={this.socket} area="c" t={t} />
          <Empty area="d" t={t} />
          <Empty area="e" t={t} />
          <Empty area="f" t={t} />
        </Grid>
      </div>
    );
    }
}

export default withI18N(Vac);
