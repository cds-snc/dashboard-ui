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
  .vac {
    fill: #33a02c;
    background-color: #33a02c;
  }
  .cds {
    fill: #1f78b4;
    background-color: #1f78b4;
  }
`;
const legend = css`
  color: white;
  flex-direction: row-reverse;
  display: flex;
`;
const legendEntry = css`
  display: flex;
  margin-right: ${margin.right}px;
`;
const swatch = css`
  height: 16px;
  width: 16px;
  background-color: white;
  margin-right: 10px;
`;

export default class Deploys extends React.Component {
  state={counter: 0};

  chartId;
  constructor(props) {
    super(props);
    this.chartId = "deploys-cds";
    let channel = props.socket.channel("data_source:github_vac_deploys", {});

    channel.join().receive("error", (resp) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload) => {
      this.setState({ payload: payload });
    });
  }

  getData = () => {
    if (!this.state || !this.state.payload || !this.state.payload.data) {
      return [];
    }
    let { data } = this.state.payload;


    data = data
      .filter(x => x.mergedAt)
      .map(x => {
        x.mergedAtDate = new Date(x.mergedAt);
        x.startDate = d3.timeMonth(x.mergedAtDate);
        x.authorOrgs = x.author.organizations.nodes.map(d => d.login);
        x.cdsAuthor = x.authorOrgs.indexOf("cds-snc") > -1;
        return x;
      });

    let dataMonthly = d3.nest()
      .key(d => d.startDate.toString()).sortKeys(d3.ascending)
      .key(d => d.cdsAuthor.toString()).sortKeys(d3.descending)
      .rollup(d => d.length)
      .entries(data);

    var newData = [];
    dataMonthly.forEach(x => {
      var total = 0;
      x.values.forEach(y => {
        var startDate = new Date(x.key);
        newData.push({
          className: y.key === "true" ? "cds" : "vac",
          value: y.value,
          v0: total,
          v1: total + y.value,
          startDate: startDate,
          endDate: new Date(startDate.getFullYear(), startDate.getMonth()+1, 0)
        })
        total += y.value;
      });
    });
    newData.sort(function(a, b){return a.startDate - b.startDate});
    return newData;
  };

  componentDidUpdate(prevProps) {
    const newWidth = document.getElementById(this.chartId).clientWidth;
    const newHeight = document.getElementById(this.chartId).clientHeight;
      if(Math.abs(newWidth - width) > 5 || Math.abs(newHeight - height) > 5) {
        this.setState({counter: this.state.counter + 1});
      }
  }

  render() {
    const { area, t } = this.props;
    if (!this.state || !this.state.payload) {
      return (
        <Loader t={t} />
      );
    }

    if (document.getElementById(this.chartId)){
      width = document.getElementById(this.chartId).clientWidth;
      height = document.getElementById(this.chartId).clientHeight;
    }

    let data = this.getData();
    let x = d3.scaleTime()
      .domain([new Date(2018, 2, 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)])
      .range([margin.left, width - margin.right])
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.v1)]).nice()
      .range([height - margin.bottom, margin.top]);

    d3.select("#" + this.chartId + " .x-axis")
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
      .attr("font-size", 12);

    d3.select("#" + this.chartId + " .y-axis")
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select(".domain").remove())
      .selectAll("line")
      .attr("x1", width - margin.right - margin.left);
    d3.select("#" + this.chartId + " .y-axis").attr("font-size", 12);
    return (
      <div data-testid="deploys-widget">
        <WidgetTitle>{t("deploys_title")}</WidgetTitle>

        <StyledCell area={area} center
          css={chartStyle}
          >
          <div css={legend} aria-hidden="true">
            <div css={legendEntry}>
              <div css={swatch} className="cds"></div>
              <span>CDS-SNC</span>
            </div>
            <div css={legendEntry}>
              <div css={swatch} className="vac"></div>
              <span>VAC-ACC</span>
            </div>
          </div>
          <svg
            id={this.chartId}
            width="100%"
            height="300"
            aria-label="Bar chart showing monthly deploys"
            >
            <BarChart
              data={data}
              x={x}
              y={y}
              height={height}
              margin={margin}
              ariaLabel={
                d => d.startDate.toLocaleString('en-us', { month: 'long' }) + " " + d.startDate.getFullYear().toString() + ": " + d.value.toString() + " deploys from " + d.className.toUpperCase()
              }
              />
          </svg>
        </StyledCell>
      </div>
    );
  }
}
