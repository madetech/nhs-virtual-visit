import TokenProvider from "../providers/TokenProvider";

const createTimeSensitiveLink = (
  headers,
  id,
  expirationTime,
  urlPath,
  hashedPassword = process.env.JWT_SIGNING_KEY
) => {
  const tokenProvider = new TokenProvider(process.env.JWT_SIGNING_KEY);
  try {
    const token = tokenProvider.generateTokenForLink(
      id,
      expirationTime,
      hashedPassword
    );
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
