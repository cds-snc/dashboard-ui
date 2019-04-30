/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from "react";
import { RouteComponentProps } from '@reach/router';
import withI18N from "./lib/i18n";

const style = css`
  margin-left: 10px;
`
interface HomePageProps extends RouteComponentProps {
  t: Function;
}

class Home extends React.Component<HomePageProps> {
    render(): JSX.Element {
    return (
        <div css={style}>{this.props.t("hello_world")}</div>
    );
    }
}

export default withI18N(Home);
