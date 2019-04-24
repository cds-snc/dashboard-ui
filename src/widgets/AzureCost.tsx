import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import { Area } from "../types";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel
} from "victory";
import { getStyles, Panel, WidgetTitle } from "../styles";

import { Loader } from "../Loader";

interface billingPeriod {
  cost: number;
  month: string;
}

interface Payload {
  data: billingPeriod[];
  timestamp: Date;
}
interface State {
  payload?: Payload;
}
interface Props {
  socket: Socket;
  area: Area;
  payload?: Payload;
  screenWidth: number;
  screenHeight: number;
}

export default class AzureCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let channel = props.socket.channel("data_source:azure_cost", {});
    let chart: any;

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
    let chartData = this.state.payload.data.sort((obj1, obj2) => {
      if (obj1.month > obj2.month) {
        return 1;
      }
      if (obj1.month < obj2.month) {
        return -1;
      }
      return 0;
    });
    return chartData.slice(-5).map(p => {
      const month = p.month.split("-");
      return {
        x: `${month[0].slice(-2)}-${month[1]}`,
        y: p.cost
      };
    });
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
      <Panel data-testid="azure-cost-widget">
      <WidgetTitle>Azure cost per month</WidgetTitle>
        <Cell center area={area} style={screenHeight > 900 ? { height: "87.5%" } : screenHeight > 800 ? { height: "80%" } : { height: "64%" } }>
          <VictoryChart
            domainPadding={30}
            style={{
              parent: { background: "#292A29", height: "100%" }
            }}
          >
            <VictoryAxis style={styles.axisYears} padding={20} />
            <VictoryAxis
              style={styles.axisOne}
              dependentAxis
              tickFormat={x => `$${x.toFixed(2)}`}
            />
            <VictoryBar
              data={this.getData()}
              style={styles.AzureBar}
              barWidth={40}
              labels={d => `$${d.y.toFixed(2)}`}
              labelComponent={<VictoryLabel style={styles.AzureBar.labels} />}
            />
          </VictoryChart>
        </Cell>
      </Panel>
    );
  }
}