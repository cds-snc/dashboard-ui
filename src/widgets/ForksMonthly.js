/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { WidgetTitle, StyledCell } from "../styles";
import { Loader } from "../Loader";
import * as d3 from "d3";
import BarChart from "./BarChart";

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
  text-align: left;
`;
const chartId = "forks";

export default class Forks extends React.Component {

  state={counter: 0};
  constructor(props) {
    super(props);
    let channel = props.socket.channel("data_source:github_vac_forks", {});

    channel.join().receive("error", (resp) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload) => {
      this.setState({ payload: payload });
    });
  }

  getData = () => {
    // var parseTime = d3.timeParse("%Y-%m");
    //
    if (!this.state || !this.state.payload) {
      return [];
    }
    let { data } = this.state.payload;

    data = data
      .map(x => {
        x.createdAtDate = new Date(x.createdAt);
        x.startDate = d3.timeMonth(x.createdAtDate);
        return x;
      })
      let dataMonthly = d3.nest()
        .key(d => d.startDate.toString())
        .rollup(d => d.length)
        .entries(data);

      dataMonthly.forEach(x => {
        x.startDate = new Date(x.key);
        x.endDate = new Date(x.startDate.getFullYear(), x.startDate.getMonth()+1, 0);
        x.value =  x.value !== undefined ? x.value : 0;
        x.v1 =  x.value;
      });
      dataMonthly.sort(function(a, b){return a.startDate - b.startDate});
      return dataMonthly;
  };

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

    let x = d3.scaleTime()
      .domain([new Date(2018, 2, 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)])
      .range([margin.left, width - margin.right])
      let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);

    d3.select("#" + chartId + " .x-axis")
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
      .attr("font-size", 12);
    d3.select("#" + chartId + " .y-axis")
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select(".domain").remove())
      .selectAll("line")
      .attr("x1", width - margin.right - margin.left);
    d3.select("#" + chartId + " .y-axis").attr("font-size", 12);
    return (
      <div data-testid={chartId+"-widget"}>
        <WidgetTitle>{t("forks_title")}</WidgetTitle>
        <StyledCell area={area} center>
        <svg
          css={chartStyle}
          id={chartId}
          width="100%"
          height="200"
          >
          <BarChart
            data={data}
            x={x}
            y={y}
            height={height}
            margin={margin}
            ariaLabel={
              d => d.startDate.toLocaleString('en-us', { month: 'long' }) + " " + d.startDate.getFullYear().toString() + ": " + d.value.toString() + " forks"
            }
          />
        </svg>
        </StyledCell>
      </div>
    );
  }
}
