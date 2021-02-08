import cookie from "cookie";
import { WARD_STAFF } from "../helpers/userTypes";

export default ({ getTokenProvider, getRetrieveDepartmentById }) => async (
  requestCookie
) => {
  const tokenProvider = getTokenProvider();
  const retrieveDepartmentById = getRetrieveDepartmentById();

  try {
    const { token } = cookie.parse(requestCookie);

    const validatedToken = tokenProvider.validate(token);

    const { error: retrieveDepartmentError } = await retrieveDepartmentById(
      validatedToken.wardId,
      validatedToken.trustId
    );

    if (retrieveDepartmentError) {
      return false;
    }

    if (token && validatedToken.type !== WARD_STAFF) {
      return false;
    }

    return token && validatedToken;
  } catch (err) {
    return false;
  }
};
