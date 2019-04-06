import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import { Area } from "../App";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel
} from "victory";
import { getStyles, Panel, WidgetTitle } from "../styles";

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
  width: number;
  height: number;
}
interface Props {
  socket: Socket;
  area: Area;
  payload?: Payload;
}

export default class HerokuCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:heroku_cost", {});
    let chart: any;

    this.state = {
      width: 0,
      height: 0,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload: Payload) => {
      this.setState({ payload: payload });
    });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
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
    return chartData.slice(-5).map(p => {
      const month = p.period_start.split("-");
      return {
        x: `${month[0].slice(-2)}-${month[1]}`,
        y: p.total / 100
      };
    });
  };

  render() {
    const { area } = this.props;
    const styles = getStyles();

    console.log(`Screen Width: ${this.state.width} Screen Height: ${this.state.height}`);

    if (!this.state || !this.state.payload) {
      return (
        <Cell center area={area} style={{ backgroundColor: "#292A29" }}>
          <Loader />
        </Cell>
      );
    }

    return (
      <Panel data-testid="heroku-cost-widget">
        <Cell center area={area} style={this.state.height > 900 ? { height: "87.5%" } : this.state.height > 800 ? { height: "80%" } : { height: "64%" } }>
        <WidgetTitle>Heroku cost per month</WidgetTitle>
          <VictoryChart
            domainPadding={40}
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
              barWidth={30}
              labels={d => `$${d.y}`}
              labelComponent={<VictoryLabel style={styles.herokuBar.labels} />}
            />
          </VictoryChart>
        </Cell>
      </Panel>
    );
  }
}
