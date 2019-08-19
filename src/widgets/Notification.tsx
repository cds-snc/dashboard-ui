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

export default class Notification extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel(
      "data_source:notification",
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
    const { t } = this.props;
    const data: Payload = this.state.payload;
    const data_source: Connection = data.data;
    const list = Object.keys(data_source).map((key, idx) => {
      return (
        <React.Fragment>
          <li key={idx} style={{ fontSize: "24px", lineHeight: "1.5em" }}>{t(key)}: {data_source[key]}</li>
        </React.Fragment>
      )
    })
    return (
      <React.Fragment>
        <ul style={{ width: "100%", "listStyleType": "none" }}>{list}</ul>
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
      <Panel data-testid="notification-widget">
        <WidgetTitle>{t("notification_title")}</WidgetTitle>
        <StyledCell center area={area}>
          {this.listItems()}
        </StyledCell>
      </Panel>
    );
  }
}
