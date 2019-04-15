import React from "react";
import { Cell } from "styled-css-grid";
import { Area } from "../Cost";
import {
    VictoryChart,
    VictoryTheme
} from 'victory';

interface Props {
    area: Area;
}

export default class Empty extends React.Component<Props> {
    render() {
        const { area } = this.props;
        return (
            <Cell area={area} center style={{ backgroundColor: "#000" }}>
                <VictoryChart
                    theme={VictoryTheme.material}
                    style={{
                        parent: { border: "1px solid #ccc" }
                    }}
                >
                </VictoryChart>
            </Cell>
        );
    }
}
