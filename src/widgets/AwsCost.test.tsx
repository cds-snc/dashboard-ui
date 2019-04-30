import React from "react";
import AwsCost from "./AwsCost";
import { cleanup, render } from "react-testing-library";
import "jest-dom/extend-expect";
import { Socket } from "phoenix";
import { data } from "./mock_payloads/AwsCostMock";

const socket = new Socket("");

afterEach(cleanup);

test("Renders AwsCost Loader", async () => {
  const { getByTestId } = render(<AwsCost socket={socket} area="a" t={(x: String) => x} />);
  expect(getByTestId("loading-widget")).toHaveTextContent("loading");
});

test("Renders AwsCost Widget", async () => {
  const { getByTestId, rerender } = render(
    <AwsCost
      socket={socket}
      area="a"
      payload={{ data: data, timestamp: new Date() }}
      t={(x: String) => x}
    />
  );

  expect(getByTestId("aws-widget")).toHaveTextContent("aws_cost_title");
});

test("Handles bad payload data", async () => {
  const { getByTestId } = render(
    <AwsCost
      socket={socket}
      area="b"
      payload={{ data: {}, timestamp: new Date() }}
      t={(x: String) => x}
    />
  );

  expect(getByTestId("aws-widget")).toHaveTextContent("Data not found");
});
