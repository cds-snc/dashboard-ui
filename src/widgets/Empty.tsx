import React from "react";
import { Area } from "../types";
import { VictoryChart, VictoryTheme, VictoryAxis } from "victory";
import {
  getStyles,
  Panel,
  WidgetTitle,
  StyledCell,
  chartContainer
} from "../styles";

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
        <StyledCell area={area} center>
          <VictoryChart
            domainPadding={50}
            style={{
              parent: {}
            }}
          >
            <VictoryAxis style={styles.axisOne} padding={20} />
            <VictoryAxis dependentAxis style={styles.axisYears} />
          </VictoryChart>
        </StyledCell>
      </Panel>
    );
  }
}
