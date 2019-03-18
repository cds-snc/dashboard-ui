import React from "react";
import { Socket } from "phoenix";
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
      <div className="memory-widget">
        <ul>{this.listItems()}</ul>
      </div>
    );
  }
}