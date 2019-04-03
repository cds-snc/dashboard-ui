import React from "react";
import AwsCost from "./AwsCost";
import { render } from "react-testing-library";
import "jest-dom/extend-expect";
import { Socket } from "phoenix";
const socket = new Socket("");

// mock get data
test("Renders AwsCost Widget", async () => {
  const { getByTestId } = render(<AwsCost socket={socket} area="a" />);
  expect(getByTestId("widget")).toHaveTextContent("loading");
});
