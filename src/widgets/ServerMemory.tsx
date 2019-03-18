import React from "react";
import { Socket } from "phoenix";
import {Cell} from "styled-css-grid";
import styled from 'styled-components';
interface Payload {data:{
  atom:number,
  atom_used:number,
  binary:number,
  code: number,
  ets: number,
  processes: number,
  processes_used: number,
  system:number,
  total: number
}, timestamp:Date}

interface State {payload:Payload };
interface Props {socket:Socket};

const Panel = styled.div`
  background: #253547;
  color: white;
  padding:1rem;
`
export default class Ping extends React.Component<Props, State> {
  constructor(props:Props) {
    super(props);
    let channel = props.socket.channel("data_source:server_memory", {});
    channel.join().receive("error", (resp:string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload:Payload) => {
      this.setState({ payload: payload});
    });
  }

  listItems = () => {
    if(!this.state || !this.state.payload){
     return null;
    }

    const data:Payload = this.state.payload;
      return (
        <React.Fragment>
        <li key="atom">
         Atom {data.data.atom}
        </li>
         <li key="atom_used">
         Atom Used {data.data.atom_used}
       </li>
       </React.Fragment>
      );
  };

  render() {
    return (
      <Cell>
      <Panel>
        <ul>{this.listItems()}</ul>
      </Panel>
      </Cell>
    );
  }
}