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
}
`;

const phaseBadge = css`
  background: #f90277;
  font-size: 1.2rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 700;
  padding: 0.2rem 0.8rem;
  margin-left: 1rem;
`

const titleContainer = css`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`

const PhaseBadge = () => {
    return (
      <span css={phaseBadge}>Alpha</span>
    );
  };

const PageHeader = () => {
  return (
    <div css={header}>
        <div>
            <div css={titleContainer}>
                <h1>Loon Dashboard UI</h1>
                <PhaseBadge />
            </div>
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