/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Socket } from "phoenix";
import { Area } from "../types";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme
} from "victory";
import {
  getStyles,
  Panel,
  WidgetTitle,
  chartContainerSM,
  StyledCell
} from "../styles";

import { Loader } from "../Loader";

interface DataPoint {
  passing: string,
  release: string,
  timestamp: string,
  total: string  
}

interface Point{
  x: Date,
  y: number
}

interface Payload {
  data: DataPoint[];
  timestamp: Date;
}

interface State {
  payload?: Payload;
  data?: Point[];
}

interface Props {
  socket: Socket;
  area: Area;
  payload?: Payload;
  t: Function;
}

export default class PerformanceIndex extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let channel = props.socket.channel("data_source:cra_performance_index", {});
    let data: Point[] = [];

    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });

    channel.on("data", (payload: Payload) => {
      payload.data.forEach((point: DataPoint) => {
        const date = parseInt(point.release.split("-")[1], 10)
        data.push({x: new Date(date), y: parseInt(point.passing, 10)});
      });
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
    const { area, t } = this.props;
    const styles = getStyles();

    if (!this.state || !this.state.payload) {
      return (
        <StyledCell center area={area} style={{ backgroundColor: "#292A29" }}>
          <Loader t={t} />
        </StyledCell>
      );
    }

    return (
      <Panel data-testid="performance-index-widget">
        <WidgetTitle>{t("cra_alpha_performance_index")}</WidgetTitle>
        <StyledCell area={area}>
          <div css={chartContainerSM}>
            <VictoryChart
              style={{
                parent: {
                  background: "#292A29",
                  height: "100%"
                }
              }}
              scale={{ x: "time" }}
              domainPadding={20}
            >
              <VictoryAxis style={styles.axisOne} />
              <VictoryAxis dependentAxis style={styles.axisYears} />
              <VictoryLine
                style={styles.MemoryLine}
                data={this.getData()}
              />
            </VictoryChart>
          </div>
        </StyledCell>
      </Panel>
    );
  }
}
