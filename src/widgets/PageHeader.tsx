/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Link } from "@reach/router";
import CdsLogo from "../CdsLogo";
import PhaseBadge from "./PhaseBadge";
import { mqW } from "../styles";

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
    line-height: 1.6rem;
    font-size: 24pt;
  }

  ${mqW[0]} {
    h1 {
      font-size: 16pt;
    }

    a {
      font-size: 10pt;
    }

    svg {
      display: none;
    }
  }
`;

const titleContainer = css`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`;

interface Props {
  t: Function;
}

const PageHeader = (props: Props) => {
  console.log(props.t("current-language-code"))
  const { t } = props;
  return (
    <div css={header}>
      <div>
        <div css={titleContainer}>
          <h1>{t("cds_dashboard")}</h1>
          <PhaseBadge />
        </div>
        <nav css={navStyle}>
          <Link to={"/?" + t("current-language-code")}>{t("home")}</Link>
          &nbsp; | &nbsp;
          <Link to={"/cost?" + t("current-language-code")}>{t("cost_dashboard")}</Link>
          &nbsp; | &nbsp;
          <Link to={"/vac?" + t("current-language-code")}>{t("vac_dashboard")}</Link>
        </nav>
      </div>
      <div>
        <CdsLogo />
      </div>
    </div>
  );
};

export default PageHeader;
