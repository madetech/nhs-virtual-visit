const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.json(),
  defaultMeta: { service: "nhs-virtual-visit" },
});

const localFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${level}] [${timestamp}]: ${message}`;
});

if (process.env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        localFormat
      ),
    })
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
}

module.exports = logger;
