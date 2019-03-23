import React from "react";
import { Socket } from "phoenix";
import { Cell } from "styled-css-grid";
import styled from "styled-components";
import ApexCharts from "apexcharts";

interface Payload {
  data: {
    atom: number;
    atom_used: number;
    binary: number;
    code: number;
    ets: number;
    processes: number;
    processes_used: number;
    system: number;
    total: number;
  };
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
  color: white;
  padding: 1rem;
  font-size: 2rem;

  li {
    font-size: 3rem;
  }
`;

const defaultOptions = {
  chart: {
    height: 350,
    type: 'line',
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  series: [{
    name: "memory",
    data: []
  }],
  markers: {
    size: 0
  },
  legend: {
    show: false
  },
  theme: {
    palette: "palette3"
  },
  xaxis: {
    axisTicks: {
      show: false
    },
    labels:
    {
      show: false
    }
  },
  yaxis: {
    labels:
    {
      style: {
        color: "white"
      },
      formatter: (v:string) => `${parseFloat(v).toFixed(2)} MB`
    }
  }
}

export default class ServerMemory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let channel = props.socket.channel("data_source:server_memory", {});
    let chart: ApexCharts;

    let data: number[] = [];

    channel.join().receive("error", (resp: string) => {
      console.log("Unable to join: ", resp);
    }).receive("ok", () => {
      chart = new ApexCharts(this.refs.memory_chart, defaultOptions);
      chart.render();
    });
    channel.on("data", (payload: Payload) => {
      data.push(payload.data.total / 1000000)
      data = data.slice(-60)
      chart.updateSeries([{ name: "memory", data: data }])
      this.setState({ payload: payload });
    });
  }

  render() {
    const { area } = this.props;
    return (
      <Cell area={area} style={{ background: "#253547" }}>
        <Panel>
          <h2>Server Memory:</h2>
          <div ref="memory_chart" />
        </Panel>
      </Cell>
    );
  }
}
