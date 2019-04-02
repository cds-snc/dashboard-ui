import React from "react";
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import ServerMemory from "./widgets/ServerMemory";
import Time from "./widgets/Time";
import Connected from "./widgets/Connected";
import Uptime from "./widgets/Uptime";
import Github from "./widgets/Github";
import Logo from "./widgets/Logo";
import AwsCost from "./widgets/AwsCost";
import TestWidget from "./widgets/TestWidget";
import HerokuCost from "./widgets/HerokuCost";
import GoogleCloudCost from "./widgets/GoogleCloudCost";
import Empty from "./widgets/Empty";
import styled from "styled-components";

/* https://github.com/azz/styled-css-grid */

const DATA_URL = "wss://loon-server.herokuapp.com/socket";


interface Props {} // eslint-disable-line @typescript-eslint/no-empty-interface
class App extends React.Component<Props> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: Props) {
    super(props);
    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  render(): JSX.Element {
    return (
        <div className="App">
            <p>This is to test the theme</p>
            <Grid
              height="100vh"
              areas={["a b c d", "e f h g"]}
              columns="4"
              gap="10px"
            >
              <HerokuCost area="a" socket={this.socket} />
              <AwsCost area="b" socket={this.socket} />
              <GoogleCloudCost area="c" socket={this.socket} />
              <TestWidget area="d" />
              <ServerMemory area="e" socket={this.socket} />
              <Empty area="f" />
              <Empty area="g" />
              <Empty area="h" />
            </Grid>
        </div>
    );
  }
}

export default App;
