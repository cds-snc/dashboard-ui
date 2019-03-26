import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";

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

const Panel = styled.div`
  color: white;
  padding: 1rem;
  font-size: 2rem;
`;

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

  listItems = () => {
    if (!this.state || !this.state.payload) {
      return null;
    }
    console.log(this.state.payload.data)

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
    const list = costItems.map((item: CostItem, index: number) => {
      return (
        <React.Fragment>
          <li key="{index}">{item.project}: ${parseFloat(item.cost).toFixed(2)}</li>
        </React.Fragment>
      )
    })
    return (
      <React.Fragment>
        <ul style={{ width: "700px" }}>{list}</ul>
      </React.Fragment>
    );
  };

  render() {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const data: Payload = this.state.payload;
    const { area } = this.props;
    return (
      <Cell area={area} style={{ backgroundColor: "#34a852" }} center>
        <Panel>
          <h2>Google cloud cost for this month:</h2>
          {this.listItems()}
        </Panel>
      </Cell>
    );
  }
}
