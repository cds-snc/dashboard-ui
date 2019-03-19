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
  font-size:1.5rem;
`

export default class Github extends React.Component<Props, State> {
  constructor(props:Props) {
    super(props);
    let channel = props.socket.channel("data_source:connected_data_sources", {});
    channel.join().receive("error", (resp:string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload:Payload) => {
      console.log(payload)
      this.setState({ payload: payload});
    });
  }

  render() {
    if(!this.state || !this.state.payload){
      return null;
     }
 
    const data:Payload = this.state.payload;
    return (
      <Cell style={{backgroundColor:"#be2dc1"}} height={4} center>
      <Panel>
        <h2>Github:</h2>
        {data.data}
      </Panel>
      </Cell>
    );
  }
}