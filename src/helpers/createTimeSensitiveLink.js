import jwt from "jsonwebtoken";

const createTimeSensitiveLink = (
  headers,
  emailAddress,
  hashedPassword,
  expirationTime,
  urlPath
) => {
  const token = jwt.sign({ emailAddress, hashedPassword }, hashedPassword, {
    expiresIn: expirationTime,
  });
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = headers.host;
  const origin = `${protocol}://${host}`;

  const url = `${origin}/${urlPath}/${token}`;
  return url;
};

export default createTimeSensitiveLink;
