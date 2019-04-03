export function getStyles() {
    const WHITE_COLOR = "#FFFFFF";
    const BLACK_COLOR = "#000000"
    const BLUE_COLOR = "#367BBC";
    const RED_COLOR = "#C14C54";
    const AXIS_COLOR = "#FFFFFF";
    const LIGHTGRAY_COLOR = "#f0efef";
    const BLACKDARK_COLOR = "#1A1B1E";
    const BLACKLIGHT_COLOR = "#292A29";
    const GREEN_COLOR = "#31D397";


    return {
      herokuTitle: {
        fill: WHITE_COLOR,
        fontFamily: "inherit",
        fontSize: 28,
        fontWeight: 700,
      },
      AWSTitle: {
        fill: WHITE_COLOR,
        fontFamily: "inherit",
        fontSize: 24,
        fontWeight: 700,
      },
      GCPTitle: {
        fill: WHITE_COLOR,
        fontFamily: "inherit",
        fontSize: 24,
        fontWeight: 700,
      },
      labelNumber: {
        fill: "#ffffff",
        fontFamily: "inherit",
        fontSize: "14px"
      },

      // INDEPENDENT AXIS
      axisYears: {
        grid: { strokeWidth: 0 },
        axis: { stroke: AXIS_COLOR, strokeWidth: 1},
        ticks: {
          stroke: AXIS_COLOR,
          strokeWidth: 1,
        },
        tickLabels: {
          fill: AXIS_COLOR,
          fontFamily: "inherit",
          fontSize: "12px"
        }
      },

      // DEPENDANT AXIS
      axisOne: {
        grid: { strokeWidth: 0 },
        axis: { stroke: AXIS_COLOR, strokeWidth: 1 }, 
        ticks: { stroke: AXIS_COLOR , strokeWidth: 1 },
        tickLabels: {
          fill: AXIS_COLOR,
          fontFamily: "inherit",
          fontSize: "12px",
        }
      },

      axisTwo: {
        grid: { strokeWidth: 0 },
        axis: { stroke: AXIS_COLOR, strokeWidth: 1 }, 
        ticks: { stroke: AXIS_COLOR , strokeWidth: 1 },
        tickLabels: {
          fill: AXIS_COLOR,
          fontFamily: "inherit",
          fontSize: "10px",
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

      // GOOGLE CLOUD COST WIDGET BAR STYLES
      GCPBar: {
        data: { fill: RED_COLOR },
        labels: { fill: WHITE_COLOR, fontSize: "12px" }
      }
    };
  }