import cookie from "cookie";

export default ({ requestCookie, tokens }) => {
  const { token } = cookie.parse(requestCookie);

  return token && tokens.validate(token);
};
