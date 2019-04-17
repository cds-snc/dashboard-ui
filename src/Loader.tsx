/** @jsx jsx */ jsx;
import { jsx } from "@emotion/core";
import React from "react";
import styled from "styled-components";
import { Spinner } from "./Spinner";

const Main = styled.div`
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

export const Loader = ({}) => {
  return (
    <Main>
      <Spinner />
      <div data-testid="loading-widget">loading</div>
    </Main>
  );
};
