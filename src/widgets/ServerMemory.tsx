import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
interface Payload {
  data: {
    atom: number;
    atom_used: number;
    binary: number;
    code: number;
    ets: number;
    processes: number;
    processes_used: number;
    system: number;
    total: number;
  };
  timestamp: Date;
}

interface State {
  payload: Payload;
}
interface Props {
  socket: Socket;
  area: string;
}

const Panel = styled.div`
  color: white;
  padding: 1rem;
  font-size: 2rem;

  li {
    font-size: 3rem;
  }
`;
export default class ServerMemory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:server_memory", {});
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
    return (
      <React.Fragment>
        <li key="atom">Atom: {data.data.atom}</li>
        <li key="atom_used">Atom Used: {data.data.atom_used}</li>
        <li key="binary">Binary: {data.data.binary}</li>
        <li key="code">Code: {data.data.code}</li>

        <li key="ets">ETS: {data.data.ets}</li>
        <li key="processes">Processes: {data.data.processes}</li>
        <li key="processes_used">Processes Used: {data.data.processes_used}</li>

        <li key="data.system">System: {data.data.system}</li>

        <li key="total">Total: {data.data.total}</li>
      </React.Fragment>
    );
  };

  render() {
    const { area } = this.props;
    return (
      <Cell area={area} style={{ background: "#253547" }}>
        <Panel>
          <h2>Server Memory:</h2>
          <ul style={{ width: "700px" }}>{this.listItems()}</ul>
        </Panel>
      </Cell>
    );
  }
}
