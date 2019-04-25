/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { mqW } from "../styles";
import React from "react";

const phaseBadge = css`
  background: #f90277;
  font-size: 14pt;
  border-radius: 0.5rem;
  color: white;
  font-weight: 700;
  padding: 0.2rem 0.8rem;
  margin-left: 1rem;

  ${mqW[0]} {
    font-size: 10pt;
    margin-left: 0.8rem;
  }
`;

const PhaseBadge = () => {
  return <span css={phaseBadge}>Alpha</span>;
};

export default PhaseBadge;
