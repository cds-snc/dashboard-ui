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
        <Grid
          height="100vh"
          areas={["a b c d", "e f f g"]}
          columns="4"
          gap="10px"
        >
          <Logo area="a" />
          <AwsCost area="b" socket={this.socket} />
          <Connected area="c" socket={this.socket} />
          <Github area="d" socket={this.socket} />
          <ServerMemory area="e" socket={this.socket} />
          <Uptime area="f" socket={this.socket} />
          <Time area="g" socket={this.socket} />
        </Grid>
      </div>
    );
  }
}

export default App;
