/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { WidgetTitle, Panel, StyledCell } from "../styles";
import { Loader } from "../Loader";
import * as d3 from "d3";
import TimeChart from "./TimeChart";

let width = 400;
let height = 200;
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
    // let data = [{"createdAt":"2018-07-16T11:35:49Z","nameWithOwner":"dougkeefe/vac-benefits-directory","url":"https://github.com/dougkeefe/vac-benefits-directory"},{"createdAt":"2018-07-31T21:37:59Z","nameWithOwner":"code-for-canada/vac-benefits-directory","url":"https://github.com/code-for-canada/vac-benefits-directory"},{"createdAt":"2018-09-01T21:13:31Z","nameWithOwner":"maxneuvians/vac-benefits-directory","url":"https://github.com/maxneuvians/vac-benefits-directory"},{"createdAt":"2018-10-09T14:23:01Z","nameWithOwner":"szinck1/vac-benefits-directory","url":"https://github.com/szinck1/vac-benefits-directory"},{"createdAt":"2018-12-20T19:02:52Z","nameWithOwner":"obrien-j/vac-benefits-directory","url":"https://github.com/obrien-j/vac-benefits-directory"},{"createdAt":"2019-03-13T16:24:52Z","nameWithOwner":"sidewalkballet/vac-benefits-directory","url":"https://github.com/sidewalkballet/vac-benefits-directory"},{"createdAt":"2019-03-15T07:59:18Z","nameWithOwner":"XIngJunxi/vac-benefits-directory","url":"https://github.com/XIngJunxi/vac-benefits-directory"},{"createdAt":"2019-03-15T13:05:11Z","nameWithOwner":"SupeDeDupe/vac-benefits-directory","url":"https://github.com/SupeDeDupe/vac-benefits-directory"},{"createdAt":"2019-03-19T19:13:26Z","nameWithOwner":"cds-snc/vac-benefits-directory","url":"https://github.com/cds-snc/vac-benefits-directory"}];

    data = data
      .map(x => {
        x.createdAtDate = new Date(x.createdAt);
        return x;
      })
    // const allWhens = Array.from(new Set(data.map(x => x.When)));
    // allWhens.forEach(x => {
    //   var total = 0;
    //   data.filter(d => d.When === x)
    //     .map(d => {
    //       d.p0 = total;
    //       total += d.participants;
    //       d.p1 = total;
    //       return d;
    //     });
    // })
    return data;
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

    d3.select("#" + chartId + " .x-axis")
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
      .attr("font-size", 12);

    return (
      <div data-testid={chartId+"-widget"}>
        <WidgetTitle>{t("total_forks") + ": " + data.length}</WidgetTitle>
        <StyledCell area={area} center>
        <svg
          css={chartStyle}
          id={chartId}
          width="100%"
          height="100%"
          >
          <TimeChart data={data} x={x} height={height} margin={margin} />
        </svg>
        </StyledCell>
      </div>
    );
  }
}
