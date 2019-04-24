import React from "react";
import { RouteComponentProps } from '@reach/router';
import Deploys from "./widgets/Deploys.js";
import { Socket } from "phoenix";

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

class Vac extends React.Component<RouteComponentProps> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: RouteComponentProps) {
    super(props);

    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  render(): JSX.Element {
    return (
        <React.Fragment>
          <div>Hello World</div>
          <Deploys socket={this.socket} />
        </React.Fragment>
    );
    }
}

export default Vac;
