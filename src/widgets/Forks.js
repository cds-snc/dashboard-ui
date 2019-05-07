/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import GitHubButton from 'react-github-btn';
import { WidgetTitle, StyledCell } from "../styles";

const button = css`
  margin: 16px;
`;
const Forks = (props) => {
  const { t } = props;
  return (
    <div>
      <StyledCell center>
        <div css={button}>
          <GitHubButton
            href="https://github.com/veteransaffairscanada/vac-benefits-directory/fork"
            data-size="large"
            data-show-count="true"
            aria-label="Fork veteransaffairscanada/vac-benefits-directory on GitHub"
            >
            Fork VAC-owned repo
          </GitHubButton>
        </div>
        <div css={button}>
          <GitHubButton
            href="https://github.com/cds-snc/find-benefits-and-services/fork"
            data-size="large"
            data-show-count="true"
            aria-label="Fork cds-snc/find-benefits-and-services on GitHub"
            >
            Fork whitelabel repo
          </GitHubButton>
        </div>
      </StyledCell>
    </div>
  )
}

export default Forks;
