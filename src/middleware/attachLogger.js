import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import logger from "../../logger";
import morgan from "morgan";

function jsonFormat(tokens, req, res) {
  return JSON.stringify({
    remoteAddress: tokens['remote-addr'](req, res),
    method: tokens['method'](req, res),
    url: tokens['url'](req, res),
    httpVersion: tokens['http-version'](req, res),
    statusCode: tokens['status'](req, res),
    contentLength: tokens['res'](req, res, 'content-length'),
    referrer: tokens['referrer'](req, res),
    responseTime: parseFloat(tokens['response-time'](req, res)) || null,
    userAgent: tokens['user-agent'](req, res),
  });
}


export default (req, res, context) => {
  const cookies = req?.cookies || {};
  const { sessionId } = cookies;
  const correlationId = uuidv4();
  const token = cookies.token;
  const {
    userId,
    wardId,
    trustId,
    type
  } = token ? jwt.decode(token) : {};
  context.container.logger = logger.child({
    correlationId,
    sessionId,
    userId,
    departmentId: wardId,
    organisationId: trustId,
    userType: type
  })
  if (process.env.NODE_ENV === "production") {
    morgan(jsonFormat, {
      stream: {
        write: (message) => {
          const meta = JSON.parse(message)
          context.container.logger.info(
            `${meta.method} ${meta.url} ${meta.statusCode}`,
            meta)
        }
      }
    })(req, res, () => null);
  }
}