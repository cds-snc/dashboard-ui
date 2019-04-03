import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import {
  VictoryBar, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryLabel
} from 'victory';
import { getStyles } from '../styles'

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

    return chartData.slice(-5).map((p:any) => {
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
    const styles = getStyles();

    return (
      <Cell center area={area} style={{ backgroundColor: "#292A29" }}>
        <VictoryChart
          //theme={VictoryTheme.material}
          domainPadding={30}
          height={300}
          width={375}
          style={{
            parent: { background: "#292A29" }
          }}
        >
          <VictoryLabel
            text="AWS cost per month"
            style={styles.AWSTitle}
            x={47}
            y={15}
          />
          <VictoryAxis
            style={styles.axisOne}
            padding={20}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => (`$${x}`)}
            style={styles.axisTwo}
          />
          <VictoryBar
            data={this.getData()}
            labels={(d) => (`$${d.y.toFixed(2)}`)}
            style={styles.AWSBar}
            barWidth={30}
            labelComponent={
              <VictoryLabel
                style={styles.AWSBar.labels}
              />
            }
          />
        </VictoryChart>
      </Cell>
    );
  }
}
