const verifyUserLogin = ({ getVerifyUserLoginGateway }) => async (
  email,
  password
) => {
  if (!email) {
    return {
      validUser: false,
      trust_id: null,
      type: null,
      user_id: null,
      error: "email is not defined",
    };
  }

  if (!password) {
    return {
      validUser: false,
      trust_id: null,
      type: null,
      user_id: null,
      error: "password is not defined",
    };
  }

  return await getVerifyUserLoginGateway()(email, password);
};

export default verifyUserLogin;
