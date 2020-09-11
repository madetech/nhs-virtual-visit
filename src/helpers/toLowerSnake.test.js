import toLowerSnake from "./toLowerSnake";

describe("toLowerSnake will", () => {
  it("convert Some String into some-string", () => {
    expect(toLowerSnake("Some String")).toEqual("some-string");
  });
});
