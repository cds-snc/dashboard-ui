/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Socket } from "phoenix";
import { Area } from "../types";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from "victory";
import {
  getStyles,
  Panel,
  WidgetTitle,
  chartContainer,
  StyledCell
} from "../styles";

import { Loader } from "../Loader";

interface billingPeriod {
  addons_total: number;
  charges_total: number;
  created_at: string;
  credits_total: number;
  database_total: number;
  dyno_units: number;
  id: string;
  number: number;
  payment_status: string;
  period_end: string;
  period_start: string;
  platform_total: number;
  state: number;
  total: number;
  updated_at: string;
  weighted_dyno_hours: number;
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
  t: Function;
}

export default class HerokuCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:heroku_cost", {});
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
      if (obj1.period_start > obj2.period_start) {
        return 1;
      }
      if (obj1.period_start < obj2.period_start) {
        return -1;
      }
      return 0;
    });
    return chartData.slice(-4).map(p => {
      const month = p.period_start.split("-");
      return {
        x: `${month[0].slice(-2)}-${month[1]}`,
        y: p.total / 100
      };
    });
  };

  render() {
    const { area, t } = this.props;
    const styles = getStyles();

    if (!this.state || !this.state.payload) {
      return (
        <StyledCell center area={area} style={{ backgroundColor: "#292A29" }}>
          <Loader />
        </StyledCell>
      );
    }

    return (
      <Panel data-testid="heroku-cost-widget">
        <WidgetTitle>{t("heroku_cost_title")}</WidgetTitle>
        <StyledCell center area={area}>
          <div css={chartContainer}>
            <VictoryChart
              domainPadding={50}
              style={{
                parent: { background: "#292A29" }
              }}
            >
              <VictoryAxis style={styles.axisYears} padding={20} />
              <VictoryAxis
                style={styles.axisOne}
                dependentAxis
                tickFormat={x => `$${x}`}
              />
              <VictoryBar
                data={this.getData()}
                style={styles.herokuBar}
                barWidth={40}
                labels={d => `$${d.y}`}
                labelComponent={
                  <VictoryLabel style={styles.herokuBar.labels} />
                }
              />
            </VictoryChart>
          </div>
        </StyledCell>
      </Panel>
    );
  }
}
