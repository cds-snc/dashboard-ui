/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { WidgetTitle, Panel, StyledCell } from "../styles";
import { Loader } from "../Loader";
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
      .call(d3.axisLeft(y))
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
      .attr("x1", width - margin.right - margin.left)

    d3.select("#bars")
        .selectAll("rect")
        .data(data)
        .join("rect")
          .attr("x", d => x(d.startDate))
          .attr("y", d => y(d.deploys))
          .attr("height", d => Math.abs(y(0) - y(d.deploys)))
          .attr("width", d => Math.abs(x(d.endDate) - x(d.startDate)));

  }
  componentDidUpdate(prevProps) {

    const width = document.getElementById('deploy-chart').clientWidth;
    const height = document.getElementById('deploy-chart').clientHeight;
    this.d3Stuff(width, height);
  }

  render() {
    const { area } = this.props;
    if (!this.state || !this.state.payload) {
      return (
        <Loader />
      );
    }

    return (
      <Panel data-testid="deploys-widget">
        <WidgetTitle>Deploys per month</WidgetTitle>
        <StyledCell area={area} center>
          <svg
            id="deploy-chart"
            width="100%"
            height="100%"
            >
            <g css={xAxisStyle} id="x-axis"></g>
            <g css={yAxisStyle} id="y-axis"></g>
            <g id="bars" fill="steelblue"></g>
          </svg>
        </StyledCell>
      </Panel>
    );
  }
}
