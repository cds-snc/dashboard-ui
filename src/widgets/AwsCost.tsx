import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import { Area } from "../App";
import { Loader } from "../Loader";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel
} from "victory";
import { getStyles } from "../styles";
import styled from 'styled-components';

interface Payload {
  data: any;
  timestamp: Date;
}
interface State {
  payload?: Payload;
  error: Boolean;
  width: number;
}
interface Props {
  payload?: Payload;
  socket: Socket;
  area: Area;
}

const AWSTitle = styled.h3`
  padding-top: 1.5rem;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.5rem;
  background: #292A29;
  color: #FFFFFF;
`

const Panel = styled.div`
  text-align: center;
`

export default class AwsCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      payload: this.props.payload,
      error: false,
      width: 0,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

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

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
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
    const { area } = this.props;

    const styles = getStyles();
    const data = this.getData();

    console.log(this.state.width)

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
      <AWSTitle>AWS cost per month</AWSTitle>
      <Cell center area={area} style={{ backgroundColor: "#292A29" }}>
        
          <VictoryChart
            domainPadding={30}
            padding={40}
            width={350}
            style={{
              parent: { background: "#292A29", height: "70%", paddingLeft: "0px" }
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
