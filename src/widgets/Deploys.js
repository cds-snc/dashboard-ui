/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { WidgetTitle, StyledCell } from "../styles";
import { Loader } from "../Loader";
import * as d3 from "d3";

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
  fill: #89A84F;
  .text {
    color: white;
    fill: white;
    text-anchor: middle;
  }
`;

export default class Deploys extends React.Component {

  constructor(props) {
    super(props);

    let channel = props.socket.channel("data_source:github_vac_deploys", {});

    channel.join().receive("error", (resp) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload) => {
      this.setState({ payload: payload });
    });
  }

  getData = () => {
    if (!this.state || !this.state.payload) {
      return [];
    }
    let { data } = this.state.payload;
    data = data
      .filter(x => x.mergedAt)
      .map(x => {
        x.mergedAtDate = new Date(x.mergedAt);
        x.startDate = d3.timeMonth(x.mergedAtDate);
        return x;
      });
    let dataMonthly = d3.nest()
      .key(d => d.startDate.toString())
      .rollup(d => d.length)
      .entries(data);

    dataMonthly.forEach(x => {
      x.startDate = new Date(x.key);
      x.endDate = new Date(x.startDate.getFullYear(), x.startDate.getMonth()+1, 0);
      x.deploys =  x.value !== undefined ? x.value : 0;
    });
    dataMonthly.sort(function(a, b){return a.startDate - b.startDate});
    return dataMonthly;
  };

  d3Stuff = (width, height) => {
    let data = this.getData();
    let margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 40
    }
    let x = d3.scaleTime()
      .domain([d3.min(data, d => d.startDate), d3.max(data, d => d.endDate)])
      .range([margin.left, width - margin.right])
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.deploys)]).nice()
      .range([height - margin.bottom, margin.top]);

    let xAxis = (g) => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

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

    d3.select("#x-axis").call(xAxis);

    d3.select("#y-axis")
      .call(yAxis)
      .selectAll("line")
      .attr("x1", width - margin.right - margin.left);

  d3.select("#x-axis").attr("font-size", 12);
  d3.select("#y-axis").attr("font-size", 12);

  var bar = d3.select("#bars")
    .selectAll("g")
      .data(data)
    .join("g")
      .attr("transform", function(d, i) { return "translate(" + x(d.startDate) + ", 0)"; })
      .attr("aria-label", d => d.deploys.toString() + " deploys in " + d.startDate.toLocaleString('en-us', { month: 'long' }) + " " + d.startDate.getFullYear().toString())

  bar.append("rect")
        .attr("y", d => y(d.deploys))
        .attr("height", d => Math.abs(y(0) - y(d.deploys)))
        .attr("width", d => Math.abs(x(d.endDate) - x(d.startDate)));

  bar.append("text")
      .attr("class", "text")
      .attr("x", d => 0.5*Math.abs(x(d.endDate) - x(d.startDate)))
      .attr("y", d => y(d.deploys) - 5)
      .text(d => d.deploys)
      .attr("aria-hidden", "true");

  }
  componentDidUpdate(prevProps) {

    const width = document.getElementById('deploy-chart').clientWidth;
    const height = document.getElementById('deploy-chart').clientHeight;
    this.d3Stuff(width, height);
  }

  render() {
    const { area, t } = this.props;
    if (!this.state || !this.state.payload) {
      return (
        <Loader t={t} />
      );
    }

    return (
      <div data-testid="deploys-widget">
        <WidgetTitle>{t("deploys_title")}</WidgetTitle>
        <StyledCell area={area} center>
          <svg
            css={chartStyle}
            id="deploy-chart"
            width="100%"
            height="300"
            >
            <g css={xAxisStyle} id="x-axis" aria-hidden="true"></g>
            <g css={yAxisStyle} id="y-axis" aria-hidden="true"></g>
            <g css={barStyle} id="bars" fill="steelblue"></g>
          </svg>
        </StyledCell>
      </div>
    );
  }
}
