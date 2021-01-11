import jwt from "jsonwebtoken";

const createTimeSensitiveLink = (
  headers,
  emailAddress,
  hashedPassword,
  expirationTime,
  urlPath
) => {
  try {
    const token = jwt.sign({ emailAddress, hashedPassword }, hashedPassword, {
      expiresIn: expirationTime,
    });
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = headers.host;
    const origin = `${protocol}://${host}`;

    const link = `${origin}/${urlPath}/${token}`;
    return {
      link,
      linkError: null,
    };
  } catch (error) {
    return {
      link: "",
      linkError: error,
    };
  }
};

export default createTimeSensitiveLink;
