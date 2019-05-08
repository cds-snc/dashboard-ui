/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Socket } from "phoenix";
import { Loader } from "../Loader";
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
  t: Function;
}

const style = css`
  color: white;
  a {
    color: white;
  }
`;
const bigNumber = css`
  font-size: 3em;
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
    return `${(seconds / 60 / 60).toFixed(1)} hours`
  }

  render() {
    const { t } = this.props;

    if (!this.state
      || !this.state.payload
      || !this.state.payload.data
      || !this.state.payload.data.monitors
    ) {
      return (
        <Loader t={t} />
      );
    }

    const data: Payload = this.state.payload;
    const vacData = data.data.monitors.filter(x => x.friendly_name === "VAC Live")[0];

    return (
      <div css={style}>
        <div css={bigNumber}>
          {this.calculateDuration(vacData.logs[0].duration)}
        </div>
        <div>
          of {vacData.status === 2 ? "uptime" : "downtime"} for <a href={vacData.url}>benefits-avantages.veterans.gc.ca</a>
        </div>
      </div>
    );
  }
}
