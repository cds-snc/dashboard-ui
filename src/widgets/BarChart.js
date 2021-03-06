/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import * as d3 from "d3";

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
  fill: #1f78b4;
  .text {
    color: white;
    fill: white;
    text-anchor: middle;
    opacity: 0;
  }
  .text-background {
    fill: #292A29;
    opacity: 0;
  }
  rect {
    opacity: 1;
    :hover {
      opacity: 0.8;
    }
  }
`;

const barGroup = css`
  :hover {
    .text {
      opacity: 1;
    }
    .text-background {
      opacity: 1;
    }
  }
`;

const BarChart = (props) => {
  const isFirefox = typeof InstallTrigger !== 'undefined';
  const { x, y, height, margin, ariaLabel } = props;
  var data = props.data.map(x => {
    x.textPosition = d3.max(props.data.filter(y => y.startDate.toDateString() === x.startDate.toDateString()), d => d.v1);
    return x;
  });
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
        css={isFirefox ? null : barGroup}
        transform={"translate(" + x(d.startDate) + ", 0)"}
        aria-label={ariaLabel(d)}
        >
          <rect
            y={y(d.v1)}
            height={Math.abs(y(0) - y(d.value))}
            width={Math.abs(x(d.endDate) - x(d.startDate))}
            className={d.className ? d.className : null}
            onMouseOver={props.mouseover ? props.mouseover(d) : null}
          >
          </rect>
          <text
            className="text"
            x={0.5*Math.abs(x(d.endDate) - x(d.startDate))}
            y={d.textPosition ? y(d.textPosition) - 5 : y(d.v1) - 5}
            aria-hidden="true"
          >
            {d.textPosition}
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
