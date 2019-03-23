import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
import ApexCharts from "apexcharts";

interface Payload {
  data: any;
  timestamp: Date;
}
interface State {
  payload: Payload;
}
interface Props {
  socket: Socket;
  area: string;
}

const Panel = styled.div`
  color: #000;
  padding: 1rem;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default class AwsCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:aws_cost", {});
    let chart: any;

    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload: Payload) => {
      this.setState({ payload: payload });

      let current = parseFloat(
        payload.data.current_month.ResultsByTime[0].Total.UnblendedCost.Amount
      );
      let forecast = parseFloat(payload.data.forecast.Total.Amount);
      let past = parseFloat(
        payload.data.last_month.ResultsByTime[0].Total.UnblendedCost.Amount
      );

      let chartOptions = {
        chart: {
          height: 1000,
          width: 1000,
          type: "radialBar"
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              
              name: {
                fontSize: "35px",
                offsetY:-40,
              },
              value: {
                fontSize: "50px",
              },
              total: {
                show: true,
                label: `Starting ${
                  payload.data.current_month.ResultsByTime[0].TimePeriod.Start
                }`,
                formatter: function(w: string) {
                  return `$${current.toFixed(2)} / $${past.toFixed(2)}`;
                }
              }
            }
          }
        },
        series: [
          100,
          ((forecast / past) * 100).toFixed(2),
          ((current / past) * 100).toFixed(2)
        ],
        labels: ["Last month", "Forecast", "Current month"]
      };
      chart = new ApexCharts(this.refs.cost_chart, chartOptions);
      chart.render();
    });
  }

  render() {
    if (!this.state || !this.state.payload) {
      return null;
    }

    const { area } = this.props;

    return (
      <Cell center area={area} style={{ backgroundColor: "#fff" }}>
        <Panel>
          <h2>AWS Monthly spending:</h2>
          <div ref="cost_chart" />
        </Panel>
      </Cell>
    );
  }
}
