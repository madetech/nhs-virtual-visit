import cookie from "cookie";

export default ({ getTokenProvider }) => (requestCookie) => {
  const tokenProvider = getTokenProvider();

  try {
    const { token } = cookie.parse(requestCookie);

    return token && tokenProvider.validate(token);
  } catch (err) {
    return false;
  }
};
