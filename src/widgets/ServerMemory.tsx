import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme
} from 'victory';

interface Payload {
  data: {
    atom: number;
    atom_used: number;
    binary: number;
    code: number;
    ets: number;
    processes: number;
    processes_used: number;
    system: number;
    total: number;
  };
  timestamp: Date;
}

interface Point {
  x: number,
  y: number
}

interface State {
  payload: Payload;
  data: number[],
}

interface Props {
  socket: Socket;
  area: string;
}

export default class ServerMemory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:server_memory", {});
    let data: number[] = [];

    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    })

    channel.on("data", (payload: Payload) => {
      // data.push({x: Date.now(), y: payload.data.total / 1000000
      data.push(payload.data.total / 1000000)
      data = data.slice(-60)
      this.setState({ payload: payload, data: data });
    });
  }

  getData = () => {
    if (!this.state || !this.state.payload) {
      return [];
    }
    return this.state.data
  }

  render() {
    if (!this.state || !this.state.payload) {
      return null;
    }
    
    const { area } = this.props;
    return (
      <Cell area={area}>
        <VictoryChart
          theme={VictoryTheme.material}
          style={{
            parent: { border: "1px solid #ccc" }
          }}
        >
          <VictoryLabel
            text="Total memory usage"
            style={{
              fontSize: "20px"
            }}
            x={10}
            y={20}
          />
          <VictoryAxis
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x:number) => (`${x.toFixed(2)} MB`)}
          />
          <VictoryLine
            interpolation="natural"
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" }
            }}
            data={this.getData()}
          />
        </VictoryChart>
      </Cell>
    );
  }
}
