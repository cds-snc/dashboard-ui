/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { RouteComponentProps } from '@reach/router';
import Deploys from "./widgets/Deploys.js";
import ResearchActivity from "./widgets/ResearchActivity.js";
import { Socket } from "phoenix";
import withI18N from "./lib/i18n";
import Uptime from "./widgets/Uptime";
import VacForks from "./widgets/VacForks";
import VacWhitelabelForks from "./widgets/VacWhitelabelForks";
import { PageTitle } from "./styles";

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

interface VacPageProps extends RouteComponentProps {
  t: Function;
}
const container1 = css`
  text-align: center;
`;
const container2 = css`
  max-width: 800px;
  margin: auto;
`;
const flex = css`
  display: flex;
  justify-content: center;
  div {
    margin: 10px;
  }
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
          <PageTitle>{t("vac_dashboard")}</PageTitle>
          <div css={flex}>
            <VacForks socket={this.socket} t={t} />
            <VacWhitelabelForks socket={this.socket} t={t} />
            <Uptime socket={this.socket} t={t} />
          </div>
          <Deploys socket={this.socket} area="a" t={t} deployOrg="cds-snc"/>
          {/*<ResearchActivity id="area-c" socket={this.socket} area="c" t={t} />*/}
        </div>
      </div>
    );
    }
}

export default withI18N(Vac);
