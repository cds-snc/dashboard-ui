import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
} from "victory";
import { getStyles, Panel, WidgetTitle } from "../styles";
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
  payload?: Payload;
  width: number;
  height: number;
}
interface Props {
  socket: Socket;
  area: Area;
  payload?: Payload;
}

export default class GoogleCloudCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    let channel = props.socket.channel("data_source:google_cloud_cost", {});
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
      <Panel data-testid="gcp-cost-widget">
      <WidgetTitle>GCP cost per month</WidgetTitle>
        <Cell
          area={area}
          style={this.state.height > 900 ? { height: "87.5%" } : this.state.height > 800 ? { height: "80%" } : { height: "64%" } }
        >
          <VictoryChart
            domainPadding={75}
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
        </Cell>
      </Panel>
    );
  }
}
