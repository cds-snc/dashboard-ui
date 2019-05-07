/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";

const xAxisStyle = css`
  color: white;
`;
const yAxisStyle = css`
  color: white;
  line {
    color: #4F4F4F;
  }
`;
const barStyle = css`
  fill: steelblue;
  .text {
    color: white;
    fill: white;
    text-anchor: middle;
  }
  .text-background {
    fill: #292A29;
    opacity: 0;
  }
  rect {
    :hover {
      opacity: 0.8;
    }
  }
  .bar-group {
    :hover {
      .text {
        opacity: 1;
      }
      .text-background {
        opacity: 1;
      }
    }
  }
  .text {
    opacity: 0;
  }
`;

const BarChart = (props) => {
  const { data, x, y, height, margin, ariaLabel } = props;
  return (
    <React.Fragment>
      <g
        css={xAxisStyle}
        className="x-axis"
        aria-hidden="true"
        transform={`translate(0,${height - margin.bottom})`}
        >
      </g>
      <g
        css={yAxisStyle}
        className="y-axis"
        aria-hidden="true"
        transform={`translate(${margin.left},0)`}
      >
      </g>
      <g css={barStyle}>
      {data.map((d, i) => (
        <g
        key={i}
        className="bar-group"
        transform={"translate(" + x(d.startDate) + ", 0)"}
        aria-label={ariaLabel(d)}
        >
          <rect
            y={y(d.v1)}
            height={Math.abs(y(0) - y(d.value))}
            width={Math.abs(x(d.endDate) - x(d.startDate))}
            className={d.className ? d.className : null}
          >
          </rect>
          <text
            className="text"
            x={0.5*Math.abs(x(d.endDate) - x(d.startDate))}
            y={d.textPosition ? y(d.textPosition) - 5 : y(d.v1) - 5}
            aria-hidden="true"
          >
            {d.value}
          </text>
          <rect
            className="text-background"
            x={-30}
            y={y(0) + 5}
            width={Math.abs(x(d.endDate) - x(d.startDate)) + 60}
            height={30}
            >
          </rect>
          <text
            className="text"
            x={0.5*Math.abs(x(d.endDate) - x(d.startDate))}
            y={y(0) + 17}
            aria-hidden="true"
          >
            {d.startDate.toDateString().split(" ")[1] + " " + d.startDate.toDateString().split(" ")[3]}
          </text>
        </g>
      ))
      }
      </g>
      </React.Fragment>

)};

export default BarChart;
