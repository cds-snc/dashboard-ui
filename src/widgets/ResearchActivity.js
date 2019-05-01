/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { WidgetTitle, Panel, StyledCell } from "../styles";
import { Loader } from "../Loader";
import * as d3 from "d3";
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
const dynamicTextStyle = css`
  padding-top: 10px;
  box-sizing: border-box;
  padding-left: ${margin.left}px;
  height: 40px;
  text-align: left;
  font-size: 12px;
`;
const chartId = "research-activity";

export default class ResearchActivity extends React.Component {

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
    console.log(this.state.payload)
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
        })
    })
    return data;
  };

  d3Stuff = (width, height) => {
    let data = this.getData();
    let x = d3.scaleTime()
      .domain([new Date(2018, 2, 1), new Date(2019, 4, 1)])
      .range([margin.left, width - margin.right])
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.p1)]).nice()
      .range([height - margin.bottom, margin.top]);

    let xAxis = (g) => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));
    // console.log(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
    let yAxis = (g) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("width", "100%")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(data.y));

    d3.select("#" + chartId + " .x-axis").call(xAxis);

    d3.select("#" + chartId + " .y-axis")
      .call(yAxis)
      .selectAll("line")
      .attr("x1", width - margin.right - margin.left);

  d3.select("#" + chartId + " .x-axis").attr("font-size", 12);
  d3.select("#" + chartId + " .y-axis").attr("font-size", 12);

  var bar = d3.select("#" + chartId +  " .bars")
    .selectAll("g")
      .data(data)
    .join("g")
      .attr("transform", d => "translate(" + x(d.startDate) + ", 0)")
      .attr("aria-label", d => d.participants.toString() + " deploys in " + d.startDate.toLocaleString('en-us', { month: 'long' }) + " " + d.startDate.getFullYear().toString())
      .on("click", d => (x) => {console.log(d.participants)})


  bar.append("rect")
        .attr("y", d => y(d.p1))
        .attr("height", d => Math.abs(y(0) - y(d.participants)))
        .attr("width", d => Math.abs(x(d.endDate) - x(d.startDate)))
        .attr("method", d => d["Method"])
        .attr("questions", d => d["Research questions"])
        .on("mouseover", function() {
            d3.select(this).attr("fill", "red");
            d3.select("#method")
              .html(d3.select(this).attr("method"))
            d3.select("#questions")
              .html(d3.select(this).attr("questions"))
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "steelblue");
        });

  bar.append("text")
      .attr("class", "text")
      .attr("x", d => 0.5*Math.abs(x(d.endDate) - x(d.startDate)))
      .attr("y", d => y(d.p1) - 5)
      .text(d => d.p1)
      .attr("aria-hidden", "true");

  }
  componentDidUpdate() {
      const width = document.getElementById(chartId).clientWidth;
      const height = document.getElementById(chartId).clientHeight;
      d3.select("#dynamic-text").style("max-width", (width-margin.left-margin.right-50) + "px")
      this.d3Stuff(width, height);
  }

  render() {
    const { area, t } = this.props;
    if (!this.state || !this.state.payload) {
      return (
        <Loader t={t}/>
      );
    }
    return (
      <Panel data-testid={chartId+"-widget"}>
        <WidgetTitle>{t("research_activity_title")}</WidgetTitle>
        <StyledCell area={area} center>
          <div css={dynamicTextStyle} id="dynamic-text">
            <div>{t("method")}: <span id="method"></span></div>
            <div>{t("research_questions")}: <span id="questions"></span></div>
          </div>
          <svg
            css={chartStyle}
            id={chartId}
            width="100%"
            height="100%"
            >
            <g css={xAxisStyle} className="x-axis" aria-hidden="true"></g>
            <g css={yAxisStyle} className="y-axis" aria-hidden="true"></g>
            <g css={barStyle} className="bars"></g>
          </svg>
        </StyledCell>
      </Panel>
    );
  }
}
