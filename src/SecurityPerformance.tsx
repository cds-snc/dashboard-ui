import React from "react";
import { RouteComponentProps } from '@reach/router';
import PerformanceIndex from "./widgets/PerformanceIndex";
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import Empty from "./widgets/Empty";
import withI18N from "./lib/i18n";

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

interface SecurityPerformancePageProps extends RouteComponentProps {
  t: Function;
}

class SecurityPerformance extends React.Component<SecurityPerformancePageProps> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: SecurityPerformancePageProps) {
    super(props);

    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  render(): JSX.Element {
    const { t } = this.props;
    document.title = t("security-performance");

    return (
      <div className="Cost">
        <Grid
          height="100vh"
          areas={["a b", "c d"]}
          columns="2"
          gap="0px"
        >
          <PerformanceIndex
            area="a"
            socket={this.socket}
            t={t}
          />
          <Empty area="b" t={t} />
          <Empty area="c" t={t} />
          <Empty area="d" t={t} />
        </Grid>
      </div>
    );
    }
}

export default withI18N(SecurityPerformance);
