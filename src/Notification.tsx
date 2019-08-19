import React from "react";
import { RouteComponentProps } from '@reach/router';
import Notification from "./widgets/Notification";
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import Empty from "./widgets/Empty";
import withI18N from "./lib/i18n";

const DATA_URL = "wss://loon-server.herokuapp.com/socket";
interface NotificationProps extends RouteComponentProps {
  t: Function;
}

class System extends React.Component<NotificationProps> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: NotificationProps) {
    super(props);

    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  render(): JSX.Element {
    const { t } = this.props;
    document.title = t("Notification");

    return (
      <div className="Cost">
        <Grid
          height="100vh"
          areas={["a b c", "d e f"]}
          columns="3"
          gap="0px"
        >
          <Notification
            area="a"
            socket={this.socket}
            t={t}
          />
          <Empty area="b" t={t} />
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
