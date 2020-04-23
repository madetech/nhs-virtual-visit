import propsWithContainer from "./propsWithContainer";

jest.mock("../containers/AppContainer");

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
