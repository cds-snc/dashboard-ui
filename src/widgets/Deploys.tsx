import React from "react";
import { Socket } from "phoenix";
import { getStyles, WidgetTitle } from "../styles";
import { Loader } from "../Loader";
import * as d3 from "d3";
// global.d.ts
// import * as _d3 from "d3";
//
// declare global {
//   const d3: typeof _d3;
// }

interface Deploy {
  mergedAtDate: Date;
  weekStartDate: Date;
  mergedAt: string;
  title: string;
  url: string;
}
interface WeeklyDeploys {
  deploys: number;
  weekStartDate: Date;
}

interface Payload {
  data: Deploy[];
  timestamp: Date;
}
interface State {
  payload?: Payload;
}
interface Props {
  socket: Socket;
  payload?: Payload;
}

export default class Deploys extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let channel = props.socket.channel("data_source:github_vac_deploys", {});

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
    let { data } = this.state.payload;
    data = data
      .filter(x => x.mergedAt)
      .map(x => {
        x.mergedAtDate = new Date(x.mergedAt);
        x.weekStartDate = d3.timeWeek(x.mergedAtDate);
        return x;
      });
    let dataWeekly = d3.nest<Deploy, number>()
      .key(d => d.weekStartDate.toString())
      .rollup(d => d.length)
      .entries(data);

    let dataWeekly2: WeeklyDeploys[] = [];
    dataWeekly.forEach(d => {
      dataWeekly2.push({
        weekStartDate: new Date(d.key),
        deploys: d.value !== undefined ? d.value : 0
      })
    });
    return dataWeekly2;
  };

  render() {
    const styles = getStyles();

    if (!this.state || !this.state.payload) {
      return (
        <Loader />
      );
    }

    let data = this.getData();
    console.log(data);

    return (
      <div data-testid="deploys-widget">
        <WidgetTitle>Deploys per week</WidgetTitle>
        <div>Deploy Chart</div>
      </div>
    );
  }
}
