/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from "react";
import { RouteComponentProps } from '@reach/router';

const style = css`
  margin-left: 10px;
`

class Home extends React.Component<RouteComponentProps> {
    render(): JSX.Element {
    return (
        <div css={style}>Home page</div>
    );
    }
}

export default Home;
