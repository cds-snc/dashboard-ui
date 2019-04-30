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
  t: Function;
}

export default class Empty extends React.Component<Props> {
  render() {
    const { area, t } = this.props;
    const styles = getStyles();
    return (
      <Panel>
        <WidgetTitle>{t("placeholder_title")}</WidgetTitle>
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
