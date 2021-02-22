import TokenProvider from "../providers/TokenProvider";
export default ({
  headers,
  uuid,
  hash,
  expirationTime,
  urlPath,
}) => {
  const tokenProvider = new TokenProvider(process.env.JWT_SIGNING_KEY);

  try {
    const token = tokenProvider.generateTokenForLink(
      uuid,
      hash,
      expirationTime,
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
      link: null,
      linkError: error,
    };
  }
};
