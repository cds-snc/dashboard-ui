import React from "react";
import { Socket } from "phoenix";
import { Grid } from "styled-css-grid";
import AwsCost from "./widgets/AwsCost";
import AzureCost from "./widgets/AzureCost";
import HerokuCost from "./widgets/HerokuCost";
import GoogleCloudCost from "./widgets/GoogleCloudCost";
import Empty from "./widgets/Empty";
import "./Cost.css";
import { RouteComponentProps } from "@reach/router";
import withI18N from "./lib/i18n";

/* https://github.com/azz/styled-css-grid */

const DATA_URL = "wss://loon-server.herokuapp.com/socket";

interface State {
  width: number;
  height: number;
}

interface CostPageProps extends RouteComponentProps {
  t: Function;
}

// interface Props {} // eslint-disable-line @typescript-eslint/no-empty-interface
class Cost extends React.Component<CostPageProps, State> {
  socket: Socket; // eslint-disable-line  @typescript-eslint/explicit-member-accessibility
  constructor(props: CostPageProps) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.socket = new Socket(DATA_URL);
    this.socket.connect();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render(): JSX.Element {
    console.log(
      `Screen Width: ${this.state.width} Screen Height: ${this.state.height}`
    );

    const { t } = this.props;
    document.title = t("cost_dashboard");

    return (
      <div className="Cost">
        <Grid
          height="100vh"
          areas={
            this.state.width > 1075
              ? ["a b", "c d"]
              : this.state.width < 450
              ? ["a", "b", "c", "d"]
              : ["a b", "c d"]
          }
          columns="3"
          gap="0px"
        >
          <AzureCost
            area="a"
            socket={this.socket}
            t={t}
          />
          <AwsCost
            area="b"
            socket={this.socket}
            t={t}
          />
          <GoogleCloudCost
            area="c"
            socket={this.socket}
            t={t}
          />
          <HerokuCost
            area="d"
            socket={this.socket}
            t={t}
          />
        </Grid>
      </div>
    );
  }
}

export default withI18N(Cost);
