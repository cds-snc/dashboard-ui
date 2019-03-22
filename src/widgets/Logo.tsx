import React from "react";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
interface Props {
  area: string;
}

const Panel = styled.div`
  background: #000;
  color: white;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
export default class Logo extends React.Component<Props> {
  render() {
    const { area } = this.props;
    return (
      <Cell area={area} center style={{ backgroundColor: "#000" }}>
        <Panel>
          <img width="200px" src={`${process.env.PUBLIC_URL}/logo.svg`} />
        </Panel>
      </Cell>
    );
  }
}
