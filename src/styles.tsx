/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { Cell } from "styled-css-grid";

const breakpointsW = [575, 950];
const breakpointsH = [360, 535];

export const mqW = breakpointsW.map(bp => `@media (max-width: ${bp}px)`);

export const mqH = breakpointsH.map(bp => `@media (max-height: ${bp}px)`);

export function getStyles() {
  const WHITE_COLOR = "#FFFFFF";
  const BLACK_COLOR = "#000000";
  const BLUE_COLOR = "#367BBC";
  const RED_COLOR = "#C14C54";
  const AXIS_COLOR = "#FFFFFF";
  const LIGHTGRAY_COLOR = "#4F4F4F";
  const BLACKDARK_COLOR = "#1A1B1E";
  const BLACKLIGHT_COLOR = "#292A29";
  const GREEN_COLOR = "#31D397";
  const YELLOW_COLOR = "#F0C656";
  const PURPLE_COLOR = "#b19cd9";

  return {
    labelNumber: {
      fill: "#ffffff",
      fontFamily: "inherit",
      fontSize: "14px"
    },

    // INDEPENDENT AXIS
    axisYears: {
      grid: { strokeWidth: 1, stroke: LIGHTGRAY_COLOR },
      axis: { stroke: AXIS_COLOR, strokeWidth: 1 },
      ticks: {
        stroke: AXIS_COLOR,
        strokeWidth: 1
      },
      tickLabels: {
        fill: AXIS_COLOR,
        fontFamily: "inherit",
        fontSize: "12px"
      }
    },

    // DEPENDANT AXIS
    axisOne: {
      grid: { strokeWidth: 1, stroke: LIGHTGRAY_COLOR },
      axis: { stroke: AXIS_COLOR, strokeWidth: 1 },
      ticks: { stroke: AXIS_COLOR, strokeWidth: 1 },
      tickLabels: {
        fill: AXIS_COLOR,
        fontFamily: "inherit",
        fontSize: "12px"
      }
    },

    axisTwo: {
      grid: { strokeWidth: 1, stroke: LIGHTGRAY_COLOR },
      axis: { stroke: AXIS_COLOR, strokeWidth: 1 },
      ticks: { stroke: AXIS_COLOR, strokeWidth: 1 },
      tickLabels: {
        fill: AXIS_COLOR,
        fontFamily: "inherit",
        fontSize: "10px"
      }
    },

    // HEROKU WIDGET BAR STYLES
    herokuBar: {
      data: { fill: GREEN_COLOR },
      labels: { fill: WHITE_COLOR, fontSize: "12px" }
    },

    // AWS WIDGET BAR STYLES
    AWSBar: {
      data: { fill: BLUE_COLOR },
      labels: { fill: WHITE_COLOR, fontSize: "12px" }
    },

    // Azure WIDGET BAR STYLES
    AzureBar: {
      data: { fill: PURPLE_COLOR },
      labels: { fill: WHITE_COLOR, fontSize: "12px" }
    },

    // GOOGLE CLOUD COST WIDGET BAR STYLES
    GCPBar: {
      data: { fill: RED_COLOR },
      labels: { fill: WHITE_COLOR, fontSize: "12px" }
    },

    // TOTAL MEMORY WIDGET BAR STYLES
    MemoryLine: {
      data: { stroke: YELLOW_COLOR, strokeWidth: 6 },
      parent: { border: "1px solid #ccc" },
      labels: { fill: WHITE_COLOR, fontSize: "12px" }
    }
  };
}

export const WidgetTitle = styled.h3`
  padding-top: 1.5rem;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.5rem;
  background: #292a29;
  color: #ffffff;

  ${mqW[1]} {
    font-size: 1rem;
  }
`;

export const Panel = styled.div`
  text-align: center;
  border: 2px solid #171717;
  color: white;
`;

export const chartContainer = css`
  padding-left: 1rem;
  width: 90%;
  height: 100%;
`;

export const StyledCell = styled(Cell)`
  height: 80%;

  ${mqH[1]} {
    height: 70%;
  }

  ${mqH[0]} {
    height: 60%;
  }
`;
