const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.json(),
  defaultMeta: { service: "nhs-virtual-visit" },
});

const datadog_api_key = process.env.DATADOG_API_KEY;
const env = process.env.ENV || "dev";

if (datadog_api_key !== undefined) {
  logger.add(
    new winston.transports.Http({
      host: 'http-intake.logs.datadoghq.eu',
      path: `/v1/input/${datadog_api_key}?ddsource=nodejs&service=virtualvisits-${env}`,
      ssl: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  );
}

const localFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${level}] [${timestamp}]: ${message}`;
});

if (process.env.NODE_ENV !== "production") {
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
