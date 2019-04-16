import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import { Area } from "../App";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme
} from "victory";
import { getStyles, Panel, WidgetTitle } from "../styles";

import { Loader } from "../Loader";

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
  x: number;
  y: number;
}

interface State {
  payload?: Payload;
  data?: number[];
}

interface Props {
  socket: Socket;
  area: Area;
  payload?: Payload;
  screenHeight: number; 
  screenWidth: number;
}

export default class ServerMemory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let channel = props.socket.channel("data_source:server_memory", {});
    let data: number[] = [];

    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });

    channel.on("data", (payload: Payload) => {
      // data.push({x: Date.now(), y: payload.data.total / 1000000
      data.push(payload.data.total / 1000000);
      data = data.slice(-60);
      this.setState({ payload: payload, data: data });
    });
  }

  getData = () => {
    if (!this.state || !this.state.payload) {
      return [];
    }
    return this.state.data;
  };

  render() {
    const { area, screenHeight, screenWidth } = this.props;
    const styles = getStyles();

    if (!this.state || !this.state.payload) {
      return (
        <Cell center area={area} style={{ backgroundColor: "#292A29" }}>
          <Loader />
        </Cell>
      );
    }

    return (
      <Panel data-testid="server-memory-widget">
      <WidgetTitle>Total memory usage</WidgetTitle>
        <Cell
          area={area}
          style={screenHeight > 900 ? { height: "87.5%" } : screenHeight > 800 ? { height: "80%" } : { height: "64%" } }
        >
          <VictoryChart
            style={{
              parent: { background: "#292A29", height: "100%" }
            }}
          >
            <VictoryAxis style={styles.axisOne} />
            <VictoryAxis
              dependentAxis
              tickFormat={(x: number) => `${x.toFixed(2)} MB`}
              style={styles.axisYears}
            />
            <VictoryLine
              interpolation="natural"
              style={styles.MemoryLine}
              data={this.getData()}
            />
          </VictoryChart>
        </Cell>
      </Panel>
    );
  }
}
