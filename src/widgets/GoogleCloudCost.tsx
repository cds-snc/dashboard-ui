import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryStack
} from "victory";
import { getStyles } from "../styles";
import { Area } from "../App";
import { Loader } from "../Loader";

interface CostItem {
  cost: string;
  month: string;
  project: string;
}

interface Payload {
  data: CostItem[];
  timestamp: Date;
}
interface State {
  payload: Payload;
}
interface Props {
  socket: Socket;
  area: Area;
}

export default class GoogleCloudCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:google_cloud_cost", {});
    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload: Payload) => {
      this.setState({ payload: payload });
    });
  }

  getData = () => {
    if (!this.state || !this.state.payload) {
      return [];
    }

    let data: { [index: string]: number } = {};
    this.state.payload.data.forEach(item => {
      if (!data.hasOwnProperty(item.month)) {
        data[item.month] = 0.0 + parseFloat(item.cost);
      } else {
        data[item.month] = data[item.month] + parseFloat(item.cost);
      }
    });

    return Object.keys(data).map(
      (key: string): { x: string; y: number } => {
        return {
          x: `${key.slice(2, 4)}-${key.slice(4, 6)}`,
          y: data[key]
        };
      }
    );
  };

  render() {
    const { area } = this.props;
    const styles = getStyles();
    if (!this.state || !this.state.payload) {
      return (
        <Cell center area={area} style={{ backgroundColor: "#292A29" }}>
          <Loader />
        </Cell>
      );
    }

    return (
      <Cell
        area={area}
        style={{ backgroundColor: "#292A29", paddingLeft: "20px" }}
      >
        <VictoryChart
          domainPadding={75}
          height={280}
          width={350}
          style={{
            parent: { background: "#292A29" }
          }}
        >
          <VictoryLabel
            text="GCP cost per month"
            style={styles.GCPTitle}
            x={47}
            y={20}
          />
          <VictoryAxis style={styles.axisOne} padding={20} />
          <VictoryAxis
            dependentAxis
            tickFormat={x => `$${x.toFixed(2)}`}
            style={styles.axisYears}
          />
          <VictoryBar
            data={this.getData()}
            labels={d => `$${d.y.toFixed(2)}`}
            barWidth={40}
            style={styles.GCPBar}
            labelComponent={<VictoryLabel style={styles.GCPBar.labels} />}
          />
        </VictoryChart>
      </Cell>
    );
  }
}
