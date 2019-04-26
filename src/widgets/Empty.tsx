import React from "react";
import { Area } from "../types";
import { VictoryChart, VictoryAxis } from "victory";
import {
  getStyles,
  Panel,
  WidgetTitle,
  StyledCell
} from "../styles";

interface Props {
  area: Area;
}

export default class Empty extends React.Component<Props> {
  render() {
    const { area } = this.props;
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
