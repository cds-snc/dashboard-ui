import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";

interface Sites {
  site: string;
  up: true;
}
interface Payload {
  data: Sites[];
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
      this.setState({ payload: payload });
    });
  }

  render() {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const data: Payload = this.state.payload;
    const { area } = this.props;
    return (
      <Cell area={area} style={{ backgroundColor: "#4a412a" }}>
        <Panel>
          <h2>Domain Status:</h2>
          {data.data.map(el => {
            const icon = el.up ? "✅" : "🚫";
            return (
              <div style={{ marginBottom: "30px" }} key={el.site}>
                {" "}
                {icon} <a href={el.site}>{el.site}</a>{" "}
              </div>
            );
          })}
        </Panel>
      </Cell>
    );
  }
}
