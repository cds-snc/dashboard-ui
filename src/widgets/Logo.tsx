import React from "react";
import { Cell } from "styled-css-grid";
import CdsLogo from '../CdsLogo'
import styled from "styled-components";
import { getStyles, Panel, WidgetTitle } from "../styles";

interface Props {
  area: string;
}

const WidgetContainer = styled.div`
  color: white;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;

  svg{
    margin-top: 40px;
  }

  p {
    font-size: 1rem;
  }
`;

export default class Logo extends React.Component<Props> {
  render() {
    const { area } = this.props;
    return (
      <Panel>
      <Cell data-testid="widget" area={area} center style={{ backgroundColor: "#292A29" }}>
        <WidgetContainer>
          <WidgetTitle>Loon UI Dashboard</WidgetTitle>
          <CdsLogo />
          <p>alpha banner</p>
        </WidgetContainer>
      </Cell>
      </Panel>
    );
  }
}
