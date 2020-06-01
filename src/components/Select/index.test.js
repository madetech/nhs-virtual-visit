import React from "react";
import { render, screen } from "@testing-library/react";
import Select from "./index";

describe("Select", () => {
  it("renders the prompt as the default option when no defaultValue is set", () => {
    render(
      <Select
        prompt="Choose an option"
        options={[
          { id: 1, name: "First Option" },
          { id: 2, name: "Second Option" },
        ]}
      />
    );

    expect(screen.getByText("Choose an option")).toBeVisible();
  });

  it("renders the prompt as the default option when defaultValue is null", () => {
    render(
      <Select
        defaultValue={null}
        prompt="Choose an option"
        options={[
          { id: 1, name: "First Option" },
          { id: 2, name: "Second Option" },
        ]}
      />
    );

    expect(screen.getByText("Choose an option")).toBeVisible();
  });

  it("renders the option with an ID matching the defaultValue", () => {
    render(
      <Select
        defaultValue={"2"}
        prompt="Choose an option"
        options={[
          { id: 1, name: "First Option" },
          { id: 2, name: "Second Option" },
        ]}
      />
    );

    expect(screen.getByText("Second Option")).toBeVisible();
  });
});
