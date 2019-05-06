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
`;
const BarChart = (props) => {
  const { data, x, y, height, margin, yName } = props;
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
        transform={"translate(" + x(d.startDate) + ", 0)"}
        aria-label={d.startDate.toLocaleString('en-us', { month: 'long' }) + " " + d.startDate.getFullYear().toString() + ": " + d.value.toString() + " " + yName}
        >
          <rect
            y={y(d.v1)}
            height={Math.abs(y(0) - y(d.value))}
            width={Math.abs(x(d.endDate) - x(d.startDate))}

          >
          </rect>
          <text
            className="text"
            x={0.5*Math.abs(x(d.endDate) - x(d.startDate))}
            y={y(d.v1) - 5}
            aria-hidden="true"
          >
            {d.v1}
          </text>
        </g>
      ))
      }
      </g>
      </React.Fragment>

)};

export default BarChart;
