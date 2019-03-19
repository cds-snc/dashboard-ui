import React from "react";
import {Cell} from "styled-css-grid";
import styled from 'styled-components';

const Panel = styled.div`
  background: #000;
  color: white;
  padding:1rem;
  font-size:2rem;
`
export default class Logo extends React.Component {
  render() {
    return (
      <Cell center style={{backgroundColor:"#000"}} height={2} width={1}>
      <Panel>
        <img width="450px" src={`${process.env.PUBLIC_URL}/logo.svg`}></img>
      </Panel>
      </Cell>
    );
  }
}