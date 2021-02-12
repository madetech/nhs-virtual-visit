import TokenProvider from "../providers/TokenProvider";
export default ({
  headers,
  uuid,
  hash,
  expirationTime,
  urlPath,
  hashedPassword = process.env.JWT_SIGNING_KEY,
  emailAddress,
}) => {
  const tokenProvider = new TokenProvider(process.env.JWT_SIGNING_KEY);
  try {
    const token = tokenProvider.generateTokenForLink(
      uuid,
      hash,
      expirationTime,
      hashedPassword,
      emailAddress
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
    console.log(error);
    return {
      link: null,
      linkError: error,
    };
  }
};
