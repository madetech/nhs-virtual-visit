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

    console.log(validatedToken);

    const { error: retrieveDepartmentError } = await retrieveDepartmentById(
      validatedToken.wardId,
      validatedToken.trustId
    );

    console.log(retrieveDepartmentError);

    if (retrieveDepartmentError) {
      return false;
    }

    if (token && validatedToken.type !== WARD_STAFF) {
      console.log("Not ward staff");
      return false;
    }

    console.log(`valid: ${token && validatedToken}`);

    return token && validatedToken;
  } catch (err) {
    return false;
  }
};
