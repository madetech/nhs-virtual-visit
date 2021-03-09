import propsWithContainer from "../../src/middleware/propsWithContainer";

jest.mock("../../src/containers/AppContainer", () => ({
  getInstance: () => ({}),
}));

describe("propsWithContainer", () => {
  it("creates and inserts an app container into the context", (done) => {
    const context = {};

    const foo = propsWithContainer((context) => {
      expect(context.container).toBeDefined();
      done();
    });

    foo(context);
  });
});
