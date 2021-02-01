const verifyAdminCode = ({ getVerifyAdminCodeGateway }) => async (
  email,
  password
) => {
  if (!email) {
    return {
      validAdminCode: false,
      error: "email is not defined",
    };
  }

  if (!password) {
    return {
      validAdminCode: false,
      error: "password is not defined",
    };
  }

  const { validAdminCode, error } = await getVerifyAdminCodeGateway()(
    email,
    password
  );

  return { validAdminCode, error };
};

export default verifyAdminCode;
