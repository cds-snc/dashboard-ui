import React from 'react';
import { Socket } from "phoenix";
import ServerMemory from "./widgets/ServerMemory";
import './App.css';

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
         <ServerMemory socket={this.socket} />
      </div>
    );
  }
}

export default App;
