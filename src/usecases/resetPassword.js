export default ({ getResetPasswordGateway }) => async ({ password, email }) => {
  if (!password) {
    return {
      resetSuccess: false,
      error: "password is not defined",
    };
  }
  if (!email) {
    return {
      resetSuccess: false,
      error: "email is not defined",
    };
  }

  try {
    const { resetSuccess, error } = await getResetPasswordGateway()({
      email,
      password,
    });
    return {
      resetSuccess,
      error,
    };
  } catch (error) {
    return {
      resetSuccess: false,
      error: error.toString(),
    };
  }
};
