/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Loader } from "../Loader";

const style = css`
  color: white;
  a {
    color: white;
  }
`;
const bigNumber = css`
  font-size: 3em;
`;

export default class Forks extends React.Component {

  constructor(props) {
    super(props);
    let channel = props.socket.channel("data_source:github_vac_whitelabel_forks", {});

    channel.join().receive("error", (resp) => {
      console.log("Unable to join: ", resp);
    });
    channel.on("data", (payload) => {
      this.setState({ payload: payload });
    });
  }

render() {
  const { t } = this.props;
  if (!this.state || !this.state.payload) {
    return (
      <Loader t={t}/>
    );
  }

  let { data } = this.state.payload;

  return (
    <div css={style}>
      <div css={bigNumber}>
        {data.length}
      </div>
      <div>
        forks to <a href="https://github.com/cds-snc/find-benefits-and-services">whitelabel repo</a>
      </div>
    </div>
  );
}
}
