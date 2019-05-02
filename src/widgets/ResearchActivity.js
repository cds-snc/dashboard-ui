/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { WidgetTitle, Panel, StyledCell } from "../styles";
import { Loader } from "../Loader";
import * as d3 from "d3";

let width = 0;
let height = 0;
let margin = {
  top: 20,
  right: 30,
  bottom: 30,
  left: 40
};

const chartStyle = css`
  font-size: 12px;
`;
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
const individualBarStyle = css`
  :hover {
    fill: red;
  }
`;

const chartId = "research-activity";

export default class ResearchActivity extends React.Component {

  state={counter: 0};
  constructor(props) {
    super(props);
    let channel = props.socket.channel("data_source:usability_testing", {});

    channel.join().receive("error", (resp) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload) => {
      this.setState({ payload: payload });
    });
  }

  getData = () => {
    var parseTime = d3.timeParse("%Y-%m");

    if (!this.state || !this.state.payload) {
      return [];
    }
    let { data } = this.state.payload;
    data = data.records
      .map(x => x.fields)
      .filter(x => x.Product !== undefined ? x.Product.indexOf("VAC") > -1 : false)
      .map(x => {
        var parsedTime = parseTime(x.When);
        x.startDate = new Date(parsedTime.getFullYear(), parsedTime.getMonth(), 1);
        x.endDate = new Date(parsedTime.getFullYear(), parsedTime.getMonth() + 1, 0);
        x.participants = +x["Total parts."];
        return x;
      })

    const allWhens = Array.from(new Set(data.map(x => x.When)));
    allWhens.forEach(x => {
      var total = 0;
      data.filter(d => d.When === x)
        .map(d => {
          d.p0 = total;
          total += d.participants;
          d.p1 = total;
          return d;
        });
    })
    return data;
  };

  getXandY = (data, width, height) => {
    let x = d3.scaleTime()
      .domain([new Date(2018, 2, 1), new Date(2019, 4, 1)])
      .range([margin.left, width - margin.right])
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.p1)]).nice()
      .range([height - margin.bottom, margin.top]);
    return {x: x, y: y};
  }

  componentDidUpdate() {
    const newWidth = document.getElementById(chartId).clientWidth;
    const newHeight = document.getElementById(chartId).clientHeight;
      if(Math.abs(newWidth - width) > 5 || Math.abs(newHeight - height) > 5) {
        this.setState({counter: this.state.counter + 1});
      }
  }

  render() {
    const { area, t } = this.props;
    if (!this.state || !this.state.payload) {
      return (
        <Loader t={t}/>
      );
    }

    if (document.getElementById(chartId)){
      width = document.getElementById(chartId).clientWidth;
      height = document.getElementById(chartId).clientHeight;
    }

    let data = this.getData();
    let {x, y} = this.getXandY(data, width, height);

    d3.select("#" + chartId + " .x-axis")
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
      .attr("font-size", 12);

    d3.select("#" + chartId + " .y-axis")
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select(".domain").remove())
      .selectAll("line")
      .attr("x1", width - margin.right - margin.left)
      .attr("font-size", 12);

      // bar.append("rect")
      //       .on("mouseover", function() {
      //           d3.select(this).attr("fill", "red");
      //           d3.select("#method")
      //             .html(d3.select(this).attr("method"))
      //           d3.select("#questions")
      //             .html(d3.select(this).attr("questions"))
      //       })
      //       .on("mouseout", function() {
      //           d3.select(this).attr("fill", "steelblue");
      //       });
      // <div css={dynamicTextStyle} id="dynamic-text">
      //   <div>{t("method")}: <span id="method"></span></div>
      //   <div>{t("research_questions")}: <span id="questions"></span></div>
      // </div>
    return (
      <Panel data-testid={chartId+"-widget"}>
        <WidgetTitle>{t("research_activity_title")}</WidgetTitle>
        <StyledCell area={area} center>
          <svg
            css={chartStyle}
            id={chartId}
            width="100%"
            height="100%"
            >
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
                aria-label={d => d.participants.toString() + " deploys in " + d.startDate.toLocaleString('en-us', { month: 'long' }) + " " + d.startDate.getFullYear().toString()}
                >
                  <rect
                    css={individualBarStyle}
                    y={y(d.p1)}
                    height={Math.abs(y(0) - y(d.participants))}
                    width={Math.abs(x(d.endDate) - x(d.startDate))}
                    method={d["Method"]}
                    questions={d["Research questions"]}
                  >
                  </rect>
                  <text
                    className="text"
                    x={0.5*Math.abs(x(d.endDate) - x(d.startDate))}
                    y={y(d.p1) - 5}
                    aria-hidden="true"
                  >
                    {d.p1}
                  </text>
                </g>
              ))
              }
            </g>
          </svg>
        </StyledCell>
      </Panel>
    );
  }
}
