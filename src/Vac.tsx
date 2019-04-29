import React from "react";
import { RouteComponentProps } from '@reach/router';
import Deploys from "./widgets/Deploys.js";
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import Empty from "./widgets/Empty";

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

class Vac extends React.Component<RouteComponentProps> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: RouteComponentProps) {
    super(props);

    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  render(): JSX.Element {
    // console.log(this.props)
    return (
      <div className="Cost">
        <Grid
          height="100vh"
          areas={["a b", "c d", "e f"]}
          columns="2"
          gap="0px"
        >
          <Deploys socket={this.socket} area="a" />
          <Empty area="b"/>
          <Empty area="c"/>
          <Empty area="d"/>
          <Empty area="e"/>
          <Empty area="f"/>
        </Grid>
      </div>
    );
    }
}

export default Vac;
