/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Socket } from "phoenix";
import { Area } from "../types";
import { Loader } from "../Loader";
import { StyledCell } from "../styles";
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
  url: string;
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
  area: Area;
  t: Function;
}

const panelStyle = css`
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

  calculateDuration = (seconds:number) => {
    return `${(seconds / 60 / 60).toFixed(2)} hours`
  }

  render() {
    const { area, t } = this.props;

    if (!this.state || !this.state.payload || !this.state.payload.data) {
      return (
        <StyledCell center area={area} style={{ backgroundColor: "#292A29" }}>
          <Loader t={t} />
        </StyledCell>
      );
    }

    const data: Payload = this.state.payload;
    const vacData = data.data.monitors.filter(x => x.friendly_name === "VAC Live");
    return (
      <div css={panelStyle}>
        <StyledCell area={area}>
          <h2>Domain Status:</h2>
          {vacData.map(el => {
            const icon = el.status == 2 ? "✅" : "🚫";
            return (
              <div style={{ marginBottom: "30px" }} key={el.id}>
                {" "}
                {icon} <a href={el.url}>{el.friendly_name}</a> for {this.calculateDuration(el.logs[0].duration)}
              </div>
            );
          })}
          </StyledCell>
        </div>
    );
  }
}
