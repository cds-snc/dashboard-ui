import React from "react";
import { Socket } from "phoenix";
import { getStyles, WidgetTitle } from "../styles";
import { Loader } from "../Loader";
import * as d3 from "d3";

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

  d3Stuff = () => {
    let data = this.getData();

    let width = 400;
    let height = 400;
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
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(data.y));

    let line = d3.line()
            .defined(d => !isNaN(d.deploys))
            .x(d => x(d.weekStartDate))
            .y(d => y(d.deploys));

    const svg = d3.select("#deploy-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    // svg.node();
  }
  componentDidUpdate(prevProps) {
    this.d3Stuff();
  }

  render() {
    const styles = getStyles();

    if (!this.state || !this.state.payload) {
      return (
        <Loader />
      );
    }

    // let data = this.getData();
    // console.log(data);
    this.d3Stuff();

    return (
      <div data-testid="deploys-widget">
        <WidgetTitle>Deploys per week</WidgetTitle>
        <div>Deploy Chart</div>
        <div id="deploy-chart">
        </div>
      </div>
    );
  }
}
