/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { Cell } from "styled-css-grid";

const breakpointsW = [460, 540, 950, 1075];
const breakpointsH = [360, 575];

export const mqW = breakpointsW.map(bp => `@media (max-width: ${bp}px)`);

export const mqH = breakpointsH.map(bp => `@media (max-height: ${bp}px)`);

export const theme = {
  colour: {
    WHITE_COLOR: "#FFFFFF",
    BLACK_COLOR: "#000000",
    BLUE_COLOR: "#367BBC",
    RED_COLOR: "#C14C54",
    AXIS_COLOR: "#FFFFFF",
    LIGHTGRAY_COLOR: "#4F4F4F",
    BLACKDARK_COLOR: "#1A1B1E",
    BLACKLIGHT_COLOR: "#292A29",
    GREEN_COLOR: "#31D397",
    YELLOW_COLOR: "#F0C656",
    PURPLE_COLOR: "#b19cd9"
  },
  font: {
    xs: "0.7em", //8pt
    sm: "0.8em", //10pt
    base: "0.75em", //12pt
    md: "0.75em", //12pt
    lg: "1.2em", //14pt
    xl: "1.6em", //20pt
    xxl: "2em" //24pt
  },
  spacing: {
    two: "2rem",
    xxs: "0.17rem",
    xs: "0.33rem",
    sm: "0.5rem",
    md: "1.0rem",
    base: "1.0rem",
    lg: "1.5rem",
    xl: "2.5rem",
    xxl: "5rem",
    xxxl: "12rem"
  }
};

export function getStyles() {
  return {
    labelNumber: {
      fill: "#ffffff",
      fontFamily: "inherit",
      fontSize: "14px"
    },

    // INDEPENDENT AXIS
    axisYears: {
      grid: { strokeWidth: 1, stroke: theme.colour.LIGHTGRAY_COLOR },
      axis: { stroke: theme.colour.AXIS_COLOR, strokeWidth: 1 },
      ticks: {
        stroke: theme.colour.AXIS_COLOR,
        strokeWidth: 1
      },
      tickLabels: {
        fill: theme.colour.AXIS_COLOR,
        fontFamily: "inherit",
        fontSize: "12px"
      }
    },

    // DEPENDANT AXIS
    axisOne: {
      grid: { strokeWidth: 1, stroke: theme.colour.LIGHTGRAY_COLOR },
      axis: { stroke: theme.colour.AXIS_COLOR, strokeWidth: 1 },
      ticks: { stroke: theme.colour.AXIS_COLOR, strokeWidth: 1 },
      tickLabels: {
        fill: theme.colour.AXIS_COLOR,
        fontFamily: "inherit",
        fontSize: "12px"
      }
    },

    axisTwo: {
      grid: { strokeWidth: 1, stroke: theme.colour.LIGHTGRAY_COLOR },
      axis: { stroke: theme.colour.AXIS_COLOR, strokeWidth: 1 },
      ticks: { stroke: theme.colour.AXIS_COLOR, strokeWidth: 1 },
      tickLabels: {
        fill: theme.colour.AXIS_COLOR,
        fontFamily: "inherit",
        fontSize: "10px"
      }
    },

    // HEROKU WIDGET BAR STYLES
    herokuBar: {
      data: { fill: theme.colour.GREEN_COLOR },
      labels: { fill: theme.colour.WHITE_COLOR, fontSize: "12px" }
    },

    // AWS WIDGET BAR STYLES
    AWSBar: {
      data: { fill: theme.colour.BLUE_COLOR },
      labels: { fill: theme.colour.WHITE_COLOR, fontSize: "12px" }
    },

    // Azure WIDGET BAR STYLES
    AzureBar: {
      data: { fill: theme.colour.PURPLE_COLOR },
      labels: { fill: theme.colour.WHITE_COLOR, fontSize: "12px" }
    },

    // GOOGLE CLOUD COST WIDGET BAR STYLES
    GCPBar: {
      data: { fill: theme.colour.RED_COLOR },
      labels: { fill: theme.colour.WHITE_COLOR, fontSize: "12px" }
    },

    // TOTAL MEMORY WIDGET BAR STYLES
    MemoryLine: {
      data: { stroke: theme.colour.YELLOW_COLOR, strokeWidth: 6 },
      parent: { border: "1px solid #ccc" },
      labels: { fill: theme.colour.WHITE_COLOR, fontSize: "12px" }
    }
  };
}

export const WidgetTitle = styled.h3`
  padding-top: ${theme.spacing.lg};
  margin-top: 0;
  margin-bottom: 0;
  font-size: ${theme.font.xl};
  background: #292a29;
  color: #ffffff;

  ${mqW[2]} {
    font-size: ${theme.font.lg};
  }

  ${mqW[0]} {
    font-size: ${theme.font.sm};
    padding-top: 0.4rem;
  }

  @media (max-height: 575px) and (max-width: 1200px) {
    padding-top: ${theme.spacing.md};
    font-size: ${theme.font.lg};
  }

  @media (max-height: 575px) and (max-width: 700px) {
    padding-top: 0.4rem;
    font-size: ${theme.font.sm};
  }
`; //These last two queries I had to make custom due to weird issues happening at these specific dimensions

export const PageTitle = styled.h2`
  padding-top: ${theme.spacing.lg};
  margin-top: 0;
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.font.xxl};
  background: #292a29;
  color: #ffffff;

  ${mqW[2]} {
    font-size: ${theme.font.xl};
  }

  ${mqW[0]} {
    font-size: ${theme.font.lg};
    padding-top: 0.4rem;
  }

  @media (max-height: 575px) and (max-width: 1200px) {
    padding-top: ${theme.spacing.md};
    font-size: ${theme.font.xl};
  }

  @media (max-height: 575px) and (max-width: 700px) {
    padding-top: 0.4rem;
    font-size: ${theme.font.lg};
  }
`;

export const Panel = styled.div`
  text-align: center;
  border: 2px solid #171717;
  color: ${theme.colour.WHITE_COLOR};
`;

export const chartContainer = css`
  padding-left: ${theme.spacing.two};
  width: 90%;
  height: 100%;

  ${mqW[2]} {
    padding-left: ${theme.spacing.md};
  }
`;

export const chartContainerSM = css`
  padding-left: 1.5rem;
  ${chartContainer}
`;

export const StyledCell = styled(Cell)`
  height: 80%;

  ${mqH[2]} {
    height: 70%;
  }

  ${mqH[0]} {
    height: 60%;
  }
`;
