import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
import { Area } from "../App";

interface Connection {
  [key: string]: string;
}

interface Payload {
  data: Connection;
  timestamp: Date;
}
interface State {
  payload: Payload;
}
interface Props {
  socket: Socket;
  area: Area;
}

const Panel = styled.div`
  color: white;
  padding: 1rem;
  font-size: 2rem;
`;

export default class Connected extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel(
      "data_source:connected_data_sources",
      {}
    );
    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload: Payload) => {
      this.setState({ payload: payload });
    });
  }

  listItems = () => {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const data: Payload = this.state.payload;
    const connections: Connection = data.data;
    const list = Object.keys(connections).map(key => {
      return (
        <React.Fragment>
          <li key="{key}">{key}: {connections[key]}</li>
        </React.Fragment>
      )
    })
    return (
      <React.Fragment>
        <ul style={{ width: "700px" }}>{list}</ul>
      </React.Fragment>
    );
  };

  render() {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const data: Payload = this.state.payload;
    const { area } = this.props;
    return (
      <Cell area={area} style={{ backgroundColor: "#34a852" }} center>
        <Panel>
          <h2>Connected:</h2>
          {this.listItems()}
        </Panel>
      </Cell>
    );
  }
}
