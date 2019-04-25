/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Socket } from "phoenix";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from "victory";
import {
  getStyles,
  Panel,
  WidgetTitle,
  chartContainer,
  StyledCell
} from "../styles";
import { Area } from "../types";
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
  payload?: Payload;
}
interface Props {
  socket: Socket;
  area: Area;
  payload?: Payload;
  screenHeight: number;
  screenWidth: number;
}

/* style={
  screenHeight > 900
    ? { height: "87.5%" }
    : screenHeight > 800
    ? { height: "80%" }
    : { height: "64%" }
} */

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
    const { area, screenHeight, screenWidth } = this.props;
    const styles = getStyles();
    if (!this.state || !this.state.payload) {
      return (
        <StyledCell center area={area} style={{ backgroundColor: "#292A29" }}>
          <Loader />
        </StyledCell>
      );
    }

    return (
      <Panel data-testid="gcp-cost-widget">
        <WidgetTitle>GCP cost per month</WidgetTitle>
        <StyledCell area={area}>
          <div css={chartContainer}>
            <VictoryChart
              domainPadding={50}
              style={{
                parent: { background: "#292A29", height: "100%" }
              }}
            >
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
          </div>
        </StyledCell>
      </Panel>
    );
  }
}
