import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
import ApexCharts from "apexcharts";

interface billingPeriod {
  addons_total: number;
  charges_total: number;
  created_at: string;
  credits_total: number;
  database_total: number;
  dyno_units: number;
  id: string;
  number: number;
  payment_status: string,
  period_end: string;
  period_start: string;
  platform_total: number;
  state: number;
  total: number;
  updated_at: string;
  weighted_dyno_hours: number;
}

interface Payload {
  data: billingPeriod[];
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

export default class HerokuCost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:heroku_cost", {});
    let chart: any;

    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload: Payload) => {
      this.setState({ payload: payload });
      let chartData = payload.data.sort((obj1, obj2) => {
        if (obj1.period_start > obj2.period_start) {
            return 1;
        }
        if (obj1.period_start < obj2.period_start) {
            return -1;
        }
        return 0;
    });
      let data = chartData.map(p => (p.total / 100))
      let labels = chartData.map(p => {
        const month = p.period_start.split("-")
        return `${month[0]}-${month[1]}`
      })

      let chartOptions = {
        chart: {
          height: 1000,
          width: 1000,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -60,
          style: {
            fontSize: '26px',
            colors: ["#304758"]
          },
          formatter: (v:string) => (`$${v}`)

        },
        series: [{
          name: 'Cost',
          data: data
        }],
        xaxis: {
          categories: labels,
          position: 'top',
          labels: {
            offsetY: -18,
            style: {
              fontSize: '26px',
              colors: ["#304758"]
            },
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              }
            }
          },
          tooltip: {
            enabled: true,
            offsetY: -35,

          }
        },
        fill: {
          gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          },
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
          }
        }
      };

      chart = new ApexCharts(this.refs.heroku_cost_chart, chartOptions);
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
          <h2>Heroku Monthly spending:</h2>
          <div ref="heroku_cost_chart" />
        </Panel>
      </Cell>
    );
  }
}
