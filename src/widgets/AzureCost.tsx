import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import { Area } from "../Cost";
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
  width: number;
  height: number;
}
interface Props {
  socket: Socket;
  area: Area;
  payload?: Payload;
}

export default class AzureCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      payload: this.props.payload
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    let channel = props.socket.channel("data_source:azure_cost", {});
    let chart: any;

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
      <Panel data-testid="azure-cost-widget">
      <WidgetTitle>Azure cost per month</WidgetTitle>
        <Cell center area={area} style={this.state.height > 900 ? { height: "87.5%" } : this.state.height > 800 ? { height: "80%" } : { height: "64%" } }>
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
