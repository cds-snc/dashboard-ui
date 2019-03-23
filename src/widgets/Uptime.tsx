import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";

interface Log {
  duration: number;
  type: number;
}
interface Monitor {
  friendly_name: string;
  id: number;
  interval: number;
  logs: Log[];
  status: number;
}
interface apiResponse {
  monitors: Monitor[];
  stat: string;
}
interface Payload {
  data: apiResponse;
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
  padding: 1rem;
  font-size: 2rem;
  color: #fff;

  a {
    color: #fff;
    display: inline-block;
    padding: 5px;
    line-height: 1.2rem;
    font-size: 3rem;
    padding-bottom: 10px;
  }
`;
export default class Uptime extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:cds_up", {});
    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload: Payload) => {
      console.log(payload)
      this.setState({ payload: payload });
    });
  }

  render() {
    if (!this.state || !this.state.payload || !this.state.payload.data) {
      return null;
    }

    const data: Payload = this.state.payload;
    const { area } = this.props;
    return (
      <Cell area={area} style={{ backgroundColor: "#4a412a" }}>
        <Panel>
          <h2>Domain Status:</h2>
          {data.data.monitors.map(el => {
            const icon = el.status == 2 ? "✅" : "🚫";
            return (
              <div style={{ marginBottom: "30px" }} key={el.id}>
                {" "}
                {icon} <a href={el.friendly_name}>{el.friendly_name}</a>{" "}
              </div>
            );
          })}
        </Panel>
      </Cell>
    );
  }
}
