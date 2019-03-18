import React from "react";
import { Socket } from "phoenix";
import {Cell} from "styled-css-grid";
import styled from 'styled-components';
interface Payload {data:string, timestamp:Date}
interface State {payload:Payload };
interface Props {socket:Socket};

const Panel = styled.div`
  background: #4285f4;
  color: white;
  padding:1rem;
`
export default class Ping extends React.Component<Props, State> {
  constructor(props:Props) {
    super(props);
    let channel = props.socket.channel("data_source:time", {});
    channel.join().receive("error", (resp:string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload:Payload) => {
      this.setState({ payload: payload});
    });
  }

  render() {
    if(!this.state || !this.state.payload){
      return null;
     }
 
    const data:Payload = this.state.payload;

    return (
      <Cell>
      <Panel>
        Time: {data.data}
      </Panel>
      </Cell>
    );
  }
}