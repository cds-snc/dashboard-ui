/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { RouteComponentProps } from '@reach/router';
import Deploys from "./widgets/Deploys.js";
import ResearchActivity from "./widgets/ResearchActivity.js";
import { Socket } from "phoenix";
import Empty from "./widgets/Empty";
import withI18N from "./lib/i18n";
import Uptime from "./widgets/Uptime";
import Forks from "./widgets/Forks";

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

interface VacPageProps extends RouteComponentProps {
  t: Function;
}
const container1 = css`
  // background-color: black;
  text-align: center;
`;
const container2 = css`
  max-width: 800px;
  margin: auto;

`;
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
      <div css={container1} className="Cost">
        <div css={container2}>
          <Uptime socket={this.socket} area="b" t={t} />
          <Deploys socket={this.socket} area="a" t={t} />
          <ResearchActivity id="area-c" socket={this.socket} area="c" t={t} />
          <Forks area="d" t={t} />
        </div>
      </div>
    );
    }
}

export default withI18N(Vac);
