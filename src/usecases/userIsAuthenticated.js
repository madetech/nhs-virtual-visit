import cookie from "cookie";

export default ({ requestCookie, tokens }) => {
  try {
    const { token } = cookie.parse(requestCookie);

    return token && tokens.validate(token);
  } catch (err) {
    return false;
  }
};
