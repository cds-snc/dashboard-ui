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
      return [];
    }

    let data:{ [index:string] : number} = {}
    this.state.payload.data.forEach(item => {
      if (!data.hasOwnProperty(item.month)){
        data[item.month] = 0.0 + parseFloat(item.cost)
      }else{
        data[item.month] = data[item.month] + parseFloat(item.cost)
      }
    })

    return Object.keys(data).map((key:string): {x:string, y:number} => {
      return {
        x: `${key.slice(2,4)}-${key.slice(4,6)}`,
        y: data[key]
      }
    })
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
            text="GCP cost per month"
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
            tickFormat={(x) => (`$${x.toFixed(2)}`)}
          />
          <VictoryBar
            data={this.getData()}
            labels={(d) => (`$${d.y.toFixed(2)}`)}
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
