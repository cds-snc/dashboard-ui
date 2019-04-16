import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import { Area } from "../types";
import { Loader } from "../Loader";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel
} from "victory";
import { getStyles, Panel, WidgetTitle } from "../styles";

interface Payload {
  data: any;
  timestamp: Date;
}
interface State {
  payload?: Payload;
  error: Boolean;
}
interface Props {
  payload?: Payload;
  socket: Socket;
  area: Area;
  screenWidth: number;
  screenHeight: number;
}

export default class AwsCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      payload: this.props.payload,
      error: false
    };

    let channel = props.socket.channel("data_source:aws_cost", {});
    let chart: any;

    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload: Payload) => {
      try {
        const results = payload.data.cost_per_month.ResultsByTime;
        this.setState({ payload: payload });
      } catch (e) {
        this.setState({ error: true });
      }
    });
  }

  getData = () => {
    let results = [];

    if (
      this.state &&
      this.state.payload &&
      this.state.payload.data &&
      this.state.payload.data.cost_per_month &&
      this.state.payload.data.cost_per_month.ResultsByTime
    ) {
      results = this.state.payload.data.cost_per_month.ResultsByTime;
    }

    let chartData = results.sort((obj1: any, obj2: any) => {
      if (obj1.TimePeriod.Start > obj2.TimePeriod.Start) {
        return 1;
      }
      if (obj1.TimePeriod.Start < obj2.TimePeriod.Start) {
        return -1;
      }
      return 0;
    });

    return chartData.slice(-5).map((p: any) => {
      const month = p.TimePeriod.Start.split("-");
      return {
        x: `${month[0].slice(-2)}-${month[1]}`,
        y: parseFloat(p.Total.UnblendedCost.Amount)
      };
    });


    // let forecast = parseFloat(this.state.payload.data.forecast.Total.Amount);
    // return [{ x: "Past", y: past }, { x: "Current", y: current }, { x: "Forecast", y: forecast }]
  };

  render() {
    const { area, screenHeight, screenWidth } = this.props;

    const styles = getStyles();
    const data = this.getData();

    // console.log(`Screen width ${this.state.width}, Screen Height: ${this.state.height}`)

    if (!this.state || !this.state.payload) {
      return (
        <Cell center area={area} style={{ backgroundColor: "#292A29" }}>
          <Loader />
        </Cell>
      );
    }

    if (this.state.error) {
      return (
        <div data-testid="error-widget">
          <h1>Something went wrong.</h1>
        </div>
      );
    }

    if (data.length < 1) {
      return (
        <Cell center area={area} style={{ backgroundColor: "#292A29" }}>
          <div data-testid="aws-widget">Data not found</div>
        </Cell>
      );
    }

    return (
      <Panel data-testid="aws-widget">

      <WidgetTitle>AWS cost per month</WidgetTitle>

      <Cell center area={area} style={screenHeight > 900 ? { height: "87.5%" } : screenHeight > 800 ? { height: "80%" } : { height: "64%" } }>

          <VictoryChart
            domainPadding={30}
            padding={40}
            style={{
              parent: { background: "#292A29", height: "100%", paddingLeft: "0px" }
            }}
          >
            <VictoryAxis style={styles.axisOne} padding={20} />
            <VictoryAxis
              dependentAxis
              tickFormat={x => `$${x}`}
              style={styles.axisTwo}
            />
            <VictoryBar
              data={data}
              labels={d => `$${d.y.toFixed(2)}`}
              style={styles.AWSBar}
              barWidth={30}
              labelComponent={<VictoryLabel style={styles.AWSBar.labels} />}
            />
          </VictoryChart>
      </Cell>
    </Panel>
    );
  }
}
