import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import {
  VictoryBar, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryLabel
} from 'victory';

interface Payload {
  data: any;
  timestamp: Date;
}
interface State {
  payload: Payload;
}
interface Props {
  socket: Socket;
  area: string;
}

export default class AwsCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:aws_cost", {});
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

    let chartData = this.state.payload.data.cost_per_month.ResultsByTime.sort((obj1:any, obj2:any) => {
      if (obj1.TimePeriod.Start > obj2.TimePeriod.Start) {
        return 1;
      }
      if (obj1.TimePeriod.Start < obj2.TimePeriod.Start) {
        return -1;
      }
      return 0;
    });

    return chartData.map((p:any) => {
      const month = p.TimePeriod.Start.split("-")
      return {
        x: `${month[0].slice(-2)}-${month[1]}`,
        y: parseFloat(p.Total.UnblendedCost.Amount)
      }
    })

    // let forecast = parseFloat(this.state.payload.data.forecast.Total.Amount);
    // return [{ x: "Past", y: past }, { x: "Current", y: current }, { x: "Forecast", y: forecast }]
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
          domainPadding={40}
          style={{
            parent: { border: "1px solid #ccc" }
          }}
        >
          <VictoryLabel
            text="AWS cost per month"
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
            labels={(d) => (`$${d.y.toFixed(2)}`)}
            labelComponent={
              <VictoryLabel
                style={{
                  fontSize: "11px"
                }}
              />
            }
          />
        </VictoryChart>
      </Cell>
    );
  }
}
