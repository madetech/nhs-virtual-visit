import cookie from "cookie";

export default ({ getTokenProvider }) => (requestCookie) => {
  const tokenProvider = getTokenProvider();

  try {
    const { token } = cookie.parse(requestCookie);

    const validatedToken = tokenProvider.validate(token);

    if (token && !validatedToken.admin) {
      return false;
    }

    return token && validatedToken;
  } catch (err) {
    return false;
  }
};
