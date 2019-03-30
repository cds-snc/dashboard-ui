import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import {
  VictoryBar, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryLabel, VictoryStack
} from 'victory';

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
  payload: Payload;
}
interface Props {
  socket: Socket;
  area: string;
}

export default class GoogleCloudCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel(
      "data_source:google_cloud_cost",
      {}
    );
    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload: Payload) => {
      this.setState({ payload: payload });
    });
  }

  getData = () => {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const data: Payload = this.state.payload;
    const costItems = data.data.sort((obj1, obj2) => {
      if (obj1.project > obj2.project) {
        return 1;
      }
      if (obj1.project < obj2.project) {
        return -1;
      }
      return 0;
    });

    return costItems.map((item: CostItem) => {
      return (<VictoryBar
        data={[{x: "Current month", y: parseFloat(item.cost).toFixed(2), project: item.project}]}
        barWidth={100}
      />)
    })
  }

  totalCost = () => {
    if (!this.state || !this.state.payload) {
      return null;
    }

    let cost = 0.0;
    this.state.payload.data.forEach(item => (cost = cost + parseFloat(item.cost)))
    return cost.toFixed(2)
  };



  render() {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const data: Payload = this.state.payload;
    const { area } = this.props;
    return (
      <Cell area={area}>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={20}
          style={{
            parent: { border: "1px solid #ccc" }
          }}
        >
          <VictoryLabel
            text="Current GCP Cost"
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
            data={[{x: "Current month", y: this.totalCost()}]}
            barWidth={100}
          />
        </VictoryChart>
      </Cell>
    );
  }
}
