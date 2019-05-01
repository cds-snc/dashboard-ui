import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
import { Area } from "../types";

import {
  Panel,
  WidgetTitle,
  StyledCell
} from "../styles";

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
  t: Function;
}

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
          <li key="{key}" style={{ fontSize: "24px", lineHeight: "1.5em" }}>{key}: {connections[key]}</li>
        </React.Fragment>
      )
    })
    return (
      <React.Fragment>
        <ul style={{ width: "100%", "list-style-type": "none" }}>{list}</ul>
      </React.Fragment>
    );
  };

  render() {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const data: Payload = this.state.payload;
    const { area, t } = this.props;
    return (
      <Panel data-testid="connected-widget">
        <WidgetTitle>{t("connected_title")}</WidgetTitle>
        <StyledCell center area={area}>
          {this.listItems()}
        </StyledCell>
      </Panel>
    );
  }
}
