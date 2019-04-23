import React from "react";
import { Cell } from "styled-css-grid";
import { Area } from "../types";
import { VictoryChart, VictoryTheme, VictoryAxis } from "victory";
import { getStyles, Panel, WidgetTitle } from "../styles";

interface Props {
  area: Area;
  screenHeight: number;
  screenWidth: number;
}

export default class Empty extends React.Component<Props> {
  render() {
    const { area, screenWidth, screenHeight } = this.props;
    const styles = getStyles();
    return (
      <Panel>
        <WidgetTitle>Placeholder widget</WidgetTitle>
        <Cell
          area={area}
          center
          style={
            screenHeight > 900
              ? { height: "87.5%" }
              : screenHeight > 800
              ? { height: "80%" }
              : { height: "64%" }
          }
        >
          <VictoryChart
            style={{
              parent: {}
            }}
          >
            <VictoryAxis style={styles.axisOne} padding={20} />
            <VictoryAxis dependentAxis style={styles.axisYears} />
          </VictoryChart>
        </Cell>
      </Panel>
    );
  }
}
