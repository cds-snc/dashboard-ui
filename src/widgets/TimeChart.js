/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";

const xAxisStyle = css`
  color: white;
`;
const barStyle = css`
fill: steelblue;
  .text {
    color: white;
    fill: white;
    text-anchor: middle;
  }
`;
const TimeChart = (props) => {
  const { data, x, height, margin } = props;

  return (
    <React.Fragment>
      <g
        css={xAxisStyle}
        className="x-axis"
        aria-hidden="true"
        transform={`translate(0,${height - margin.bottom})`}
        >
      </g>
      <g css={barStyle}>
      {data.map((d, i) => (
        <rect
          key={i}
          y={margin.top}
          height={100}
          x={x(d.createdAtDate)}
          width={3}
        >
        </rect>
      ))}
      </g>
    </React.Fragment>
  );
}

export default TimeChart;
