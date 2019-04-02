export function getStyles() {
    const WHITE_COLOR = "#FFFFFF";
    const BLACK_COLOR = "#000000"
    const BLUE_COLOR = "#00a3de";
    const RED_COLOR = "#7c270b";
    const AXIS_COLOR = "#FFFFFF";
    const LIGHTGRAY_COLOR = "#f0efef";
    const BLACKDARK_COLOR = "#1A1B1E";
    const BLACKLIGHT_COLOR = "#292A29";
    const GREEN_COLOR = "#31D397";

    return {
      title: {
        fill: WHITE_COLOR,
        fontFamily: "inherit",
        fontSize: "28px",
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

      // DATA SET ONE
      axisOne: {
        grid: {
          strokeWidth: 0
        },
        axis: { stroke: AXIS_COLOR, strokeWidth: 1 }, 
        ticks: { stroke: AXIS_COLOR , strokeWidth: 1 },
        tickLabels: {
          fill: AXIS_COLOR,
          fontFamily: "inherit",
          fontSize: "12px",
        }
      },

      // HEROKU WIDGET BAR STYLES
      herokuBar: {
        data: { fill: GREEN_COLOR },
        labels: { fill: WHITE_COLOR, fontSize: "12px" }
      }
    };
  }