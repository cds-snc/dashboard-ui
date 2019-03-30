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
    let current = parseFloat(
      this.state.payload.data.current_month.ResultsByTime[0].Total.UnblendedCost.Amount
    );
    let forecast = parseFloat(this.state.payload.data.forecast.Total.Amount);
    let past = parseFloat(
      this.state.payload.data.last_month.ResultsByTime[0].Total.UnblendedCost.Amount
    );
    return [{ x: "Past", y: past }, { x: "Current", y: current }, { x: "Forecast", y: forecast }]
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
            text="Current AWS Cost"
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
            barWidth={50}
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
