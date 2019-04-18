/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Link } from "@reach/router";
import CdsLogo from "../CdsLogo";

const navStyle = css`
color: white;

a {
  color: white;
}
`;

const header = css`
background: #171717;
padding: 2rem;

display: flex;
justify-content: space-between;
align-items: center;

svg {
  width: 4rem;
}

h1 {
  color: white;
  margin: 0;
  line-height: 1.2rem;
  margin-bottom: 1.4rem;
}
`;

const PageHeader = () => {
  return (
    <div css={header}>
        <div>
            <h1>Loon Dashboard UI (alpha banner)</h1>
            <nav css={navStyle}>
                <Link to="/">Home</Link>
                &nbsp; | &nbsp;
                <Link to="/cost">Cost Dashboard</Link>
                &nbsp; | &nbsp;
                <Link to="/vac">VAC Dashboard</Link>
            </nav>
        </div>
        <div>
          <CdsLogo />
        </div>
    </div>
  );
};

export default PageHeader;