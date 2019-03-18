import React from 'react';
import { Socket } from "phoenix";
import ServerMemory from "./widgets/ServerMemory";
import { Grid } from "styled-css-grid";

/* https://github.com/azz/styled-css-grid */

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

interface Props {}
interface State {};

class App extends React.Component<Props, State> {
  socket:Socket;
  constructor(props:Props) {
    super(props);
    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  render() {
    return (
      <div className="App">
         <Grid columns={2} gap="2px">
            <ServerMemory socket={this.socket} />
         </Grid>
      </div>
    );
  }
}

export default App;
