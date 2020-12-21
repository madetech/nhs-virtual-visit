import React from "react";
import Form from "../../src/components/Form";
import Button from "../../src/components/Button";
import { render, screen, fireEvent, act } from "@testing-library/react";

describe("<Form>", () => {
  it("should not allow multiple submits on successful submit", () => {
    const onSubmit = jest.fn(() => {
      return true;
    });

    render(
      <Form onSubmit={onSubmit}>
        <Button data-testid="submitButton">Submit</Button>
      </Form>
    );

    act(() => {
      fireEvent.click(screen.getByTestId("submitButton"));
    });

    act(() => {
      fireEvent.click(screen.getByTestId("submitButton"));
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should allow multiple submits on failed submit", () => {
    const onSubmit = jest.fn(() => {
      return false;
    });

    render(
      <Form onSubmit={onSubmit}>
        <Button data-testid="submitButton">Submit</Button>
      </Form>
    );

    act(() => {
      fireEvent.click(screen.getByTestId("submitButton"));
      fireEvent.click(screen.getByTestId("submitButton"));
    });

    expect(onSubmit).toHaveBeenCalledTimes(2);
  });
});
