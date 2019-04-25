/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { WidgetTitle, StyledCell } from "../styles";
import { Loader } from "../Loader";
import * as d3 from "d3";


const white = css`
  color: white;
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
        x.weekStartDate = d3.timeWeek(x.mergedAtDate);
        return x;
      });
    let dataWeekly = d3.nest()
      .key(d => d.weekStartDate.toString())
      .rollup(d => d.length)
      .entries(data);


    dataWeekly.forEach(d => {
      d.weekStartDate = new Date(d.key);
      d.deploys =  d.value !== undefined ? d.value : 0;
    });
    dataWeekly.sort(function(a, b){return a.weekStartDate - b.weekStartDate});
    return dataWeekly;
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
      .domain(d3.extent(data, d => d.weekStartDate))
      .range([margin.left, width - margin.right])
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.deploys)]).nice()
      .range([height - margin.bottom, margin.top]);

    let xAxis = (g) => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

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

    let line = d3.line()
            .defined(d => !isNaN(d.deploys))
            .x(d => x(d.weekStartDate))
            .y(d => y(d.deploys));

    d3.select("#x-axis").call(xAxis);
    d3.select("#y-axis")
      .call(yAxis)
      .selectAll("line")
      .attr("x1", width - margin.right - margin.left)
      .attr("color", "grey");

    d3.select("#line")
        .datum(data)
        .attr("d", line);

  }
  componentDidUpdate(prevProps) {
    let width = document.getElementById('deploy-chart').clientWidth;
    let height = document.getElementById('deploy-chart').clientHeight;
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
      <div data-testid="deploys-widget">
        <WidgetTitle>Deploys per week</WidgetTitle>
        <StyledCell area={area} center>
          <svg
            id="deploy-chart"
            width="100%"
            height="100%"
            >
            <g css={white} id="y-axis"></g>
            <g css={white} id="x-axis"></g>
            <path
              id="line"
              fill="none"
              stroke="steelblue"
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
        </StyledCell>
      </div>
    );
  }
}
