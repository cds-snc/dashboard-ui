import React from "react";
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import ServerMemory from "./widgets/ServerMemory";
import Logo from "./widgets/Logo";
import AwsCost from "./widgets/AwsCost";
import AzureCost from "./widgets/AzureCost";
import HerokuCost from "./widgets/HerokuCost";
import GoogleCloudCost from "./widgets/GoogleCloudCost";
import './App.css';

export type Area = "a" | "b" | "c" | "d" | "e" | "f";

/* https://github.com/azz/styled-css-grid */

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

interface State {
  width: number;
  height: number;
}

interface Props {} // eslint-disable-line @typescript-eslint/no-empty-interface
class App extends React.Component<Props, State> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }


  render(): JSX.Element {

    console.log(`Screen Width: ${this.state.width} Screen Height: ${this.state.height}`);

    return (
      <div className="App">
        <Grid
          height="100vh"
          areas={this.state.width > 900 ? ["a b c", "d e f"] : ["a b", "c d", "e f"]}
          columns="4"
          gap="1px"
        >
          <Logo area="a" />
          <HerokuCost screenHeight={this.state.height} screenWidth={this.state.width} area="b" socket={this.socket} />
          <AwsCost screenHeight={this.state.height} screenWidth={this.state.width} area="c" socket={this.socket} />
          <GoogleCloudCost screenHeight={this.state.height} screenWidth={this.state.width} area="d" socket={this.socket} />
          <AzureCost screenHeight={this.state.height} screenWidth={this.state.width} area="e" socket={this.socket} />
          <ServerMemory screenHeight={this.state.height} screenWidth={this.state.width} area="f" socket={this.socket} />
        </Grid>
      </div>
    );
  }
}

export default App;
