import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
import { Area } from "../types";
interface Payload {
  data: [{ blog: {} }];
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

const Content = styled.p`
  font-size: 10rem;
  margin: 0;
`;

export default class Github extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:github_org", {});
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
    const { area } = this.props;
    const data: any = this.state.payload;

    let name = "";
    if (data && data.data && data.data.public_repos) {
      name = data.data.public_repos;
    }

    return (
      <Cell area={area} style={{ backgroundColor: "#be2dc1" }} center>
        <Panel>
          <h2>Public Repos:</h2>
          <Content>{name}</Content>
        </Panel>
      </Cell>
    );
  }
}
