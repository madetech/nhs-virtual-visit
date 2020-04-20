import React from "react";
import { render } from "@testing-library/react";
import EndOfVisit from "../../pages/visits/end";

describe("end", () => {
  it("renders end of visit message", () => {
    const { getByText } = render(<EndOfVisit />);
<<<<<<< HEAD
    const text = getByText(/visit has completed/i);
    expect(text).toBeInTheDocument();
  });

  describe("for a key contact", () => {
    it("has a link to the help and support page", () => {
      const { queryByText } = render(<EndOfVisit />);
      const text = queryByText(/Get further help and support/i);
      expect(text).toBeInTheDocument();
    });
    it("does not show a link to the ward page", () => {
      const { queryByText } = render(<EndOfVisit />);
      const text = queryByText(/return to scheduled visit list/i);
      expect(text).not.toBeInTheDocument();
    });
  });

  describe("for a staff member", () => {
    it("has a link back to the ward visits page", () => {
      const { getByText } = render(<EndOfVisit wardId="TEST" />);
      const text = getByText(/return to scheduled visit list/i);
      expect(text).toBeInTheDocument();
    });
    it("does not show a link to the help and support page", () => {
      const { queryByText } = render(<EndOfVisit wardId="TEST" />);
      const text = queryByText(/Get further help and support/i);
      expect(text).not.toBeInTheDocument();
    });
  });
=======
    const text = getByText(/visit has ended/i);
    expect(text).toBeInTheDocument();
  });
>>>>>>> Adds initial end of visit page
});
