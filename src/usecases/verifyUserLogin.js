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

  const verifyUserLoginGateway = getVerifyUserLoginGateway();
  const { 
    validUser,
    trust_id, 
    type,
    user_id,
    error
  } = await verifyUserLoginGateway(email, password);

  return { 
    validUser, 
    trust_id,
    type, 
    user_id, 
    error,
  };
};

export default verifyUserLogin;
