import React from "react";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
import Countdown from "../lib/Countdown";
import { Area } from "../Cost";
interface Props {
  area: Area;
}

const Panel = styled.div`
  background: #000;
  color: white;
  padding: 0.6rem;
  font-size: 2rem;
`;

const Content = styled.p`
  font-size: 4rem;
  margin: 0;
`;

export default class Logo extends React.Component<Props> {
  render() {
    const { area } = this.props;
    return (
      <Cell area={area} center style={{ backgroundColor: "#000" }}>
        <Panel>
          <h2>Countdown:</h2>
          <h3 style={{ fontSize: "3rem" }}>Show the dev tools!!</h3>
          <Content>
            <Countdown date={`2019-03-22T14:00:00`} />
          </Content>
        </Panel>
      </Cell>
    );
  }
}
