/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";

const phaseBadge = css`
  background: #f90277;
  font-size: 1.2rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 700;
  padding: 0.2rem 0.8rem;
  margin-left: 1rem;
`

const PhaseBadge = () => {
    return (
      <span css={phaseBadge}>Alpha</span>
    );
  };

export default PhaseBadge;