import React from 'react';
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import ServerMemory from "./widgets/ServerMemory";
import Time from "./widgets/Time";
import Connected from "./widgets/Connected";
import Uptime from "./widgets/Uptime";
import Github from "./widgets/Github";
import Logo from "./widgets/Logo";
import AwsCost from "./widgets/AwsCost";
import {MyWidget} from "./widgets/MyWidget";

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
         <Grid columns="repeat(auto-fit,minmax(250px,1fr,1fr))" gap="10px">
            <ServerMemory socket={this.socket} /> 
            <Logo />
            <AwsCost socket={this.socket}/>
            <Uptime socket={this.socket}/> 
            <Github socket={this.socket}/>
            <Time socket={this.socket} />
            <Connected socket={this.socket} />
            <MyWidget socket={this.socket} feed="connected_data_sources" />
         </Grid>
      </div>
    );
  }
}

export default App;
