import React from "react";
import { Socket } from "phoenix";
import {Cell} from "styled-css-grid";
import styled from 'styled-components';

interface Payload {data:number, timestamp:Date}
interface State {payload:Payload };
interface Props {socket:Socket};

const Panel = styled.div`
  color: white;
  padding:1rem;
`

const Content = styled.p`
  font-size:1.5rem;
`

export default class Connected extends React.Component<Props, State> {
  constructor(props:Props) {
    super(props);
    let channel = props.socket.channel("data_source:connected_data_sources", {});
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
      <Cell style={{backgroundColor:"#34a852"}} height={4} center>
      <Panel>
        <h2>Connected:</h2>
        <Content>{data.data}</Content>
      </Panel>
      </Cell>
    );
  }
}