import cookie from "cookie";
import { TRUST_ADMIN } from "../helpers/userTypes";

export default ({ getTokenProvider }) => (requestCookie) => {
  const tokenProvider = getTokenProvider();

  try {
    const { token } = cookie.parse(requestCookie);

    const validatedToken = tokenProvider.validate(token);

    if (token && validatedToken.type !== TRUST_ADMIN) {
      return false;
    }

    return token && validatedToken;
  } catch (err) {
    return false;
  }
};
