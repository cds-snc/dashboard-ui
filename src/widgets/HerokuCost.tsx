import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import {
  VictoryBar, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryLabel
} from 'victory';

interface billingPeriod {
  addons_total: number;
  charges_total: number;
  created_at: string;
  credits_total: number;
  database_total: number;
  dyno_units: number;
  id: string;
  number: number;
  payment_status: string,
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
  payload: Payload;
}
interface Props {
  socket: Socket;
  area: string;
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
    return chartData.map(p => {
      const month = p.period_start.split("-")
      return {
        x: `${month[0].slice(-2)}-${month[1]}`,
        y: (p.total / 100)
      }
    }
    )
  };

  render() {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const { area } = this.props;

    return (
      <Cell center area={area} style={{ backgroundColor: "#fff" }}>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={20}
          style={{
            parent: { border: "1px solid #ccc" }
          }}
        >
          <VictoryLabel
            text="Heroku cost per month"
            style={{
              fontSize: "20px"
            }}
            x={10}
            y={20}
          />
          <VictoryAxis
            style={{
              tickLabels: { fontSize: '9px' }
            }}
            padding={20}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => (`$${x}`)}
          />
          <VictoryBar
            data={this.getData()}
            labels={(d) => (`$${d.y}`)}
            labelComponent={
              <VictoryLabel
                style={{
                  fontSize: "9px"
                }}
              />
            }
          />
        </VictoryChart>
      </Cell>
    );
  }
}
