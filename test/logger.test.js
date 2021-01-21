describe("logger", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock("winston", () => {
      const mFormat = {
        combine: jest.fn(),
        timestamp: jest.fn(),
        printf: jest.fn(),
        json: jest.fn(),
        colorize: jest.fn(),
      };
      const mTransports = {
        Console: jest.fn(),
        File: jest.fn(),
      };
      const mLogger = {
        info: jest.fn(),
        add: jest.fn(),
      };
      return {
        format: mFormat,
        transports: mTransports,
        createLogger: jest.fn(() => mLogger),
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Development logger", () => {
    process.env.NODE_ENV = "development";
    const { createLogger, format, transports } = require("winston");
    let templateFunctions = [];
    format.printf.mockImplementation((templateFn) => {
      templateFunctions.push(templateFn);
    });
    const logger = require("../logger");
    logger.info("Hello world");
    const info = {
      timestamp: 123,
      level: "info",
      message: "haha",
    };
    const tFn1 = templateFunctions[0];
    expect(tFn1(info)).toBe(
      `[${info.level}] [${info.timestamp}]: ${info.message}`
    );
    expect(format.combine).toBeCalledTimes(1);
    expect(format.printf).toBeCalledWith(expect.any(Function));
    expect(transports.Console).toBeCalledTimes(1);
    expect(createLogger).toBeCalledTimes(1);
  });

  it("Production logger", () => {
    process.env.NODE_ENV = "production";
    const { createLogger, format, transports } = require("winston");
    let templateFunctions = [];
    format.printf.mockImplementation((templateFn) => {
      templateFunctions.push(templateFn);
    });
    const logger = require("../logger");
    logger.info("Hello world");
    const info = {
      timestamp: 123,
      level: "info",
      message: "haha",
    };
    const tFn1 = templateFunctions[0];
    expect(tFn1(info)).toBe(
      `[${info.level}] [${info.timestamp}]: ${info.message}`
    );
    expect(format.combine).toBeCalledTimes(1);
    expect(format.printf).toBeCalledWith(expect.any(Function));
    expect(transports.Console).toBeCalledTimes(1);
    expect(createLogger).toBeCalledTimes(1);
  });
});
