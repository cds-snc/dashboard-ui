import React from "react";
import { RouteComponentProps } from '@reach/router';
import ServerMemory from "./widgets/ServerMemory";
import Connected from "./widgets/Connected";
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import Empty from "./widgets/Empty";
import withI18N from "./lib/i18n";

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

interface SystemPageProps extends RouteComponentProps {
  t: Function;
}

class System extends React.Component<SystemPageProps> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: SystemPageProps) {
    super(props);

    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  render(): JSX.Element {
    const { t } = this.props;
    document.title = t("system_dashboard");

    return (
      <div className="Cost">
        <Grid
          height="100vh"
          areas={["a b c", "d e f"]}
          columns="3"
          gap="0px"
        >
          <ServerMemory
            area="a"
            socket={this.socket}
            t={t}
          />
          <Connected
            area="b"
            socket={this.socket}
            t={t}
          />
          <Empty area="c" t={t} />
          <Empty area="d" t={t} />
          <Empty area="e" t={t} />
          <Empty area="f" t={t} />
        </Grid>
      </div>
    );
    }
}

export default withI18N(System);
