const createManager = ({ getInsertManagerGateway }) => async ({
  email,
  password,
  organisationId,
}) => {
  if (!email) {
    return {
      user: null,
      error: "email is not defined",
    };
  }

  if (!password) {
    return {
      user: null,
      error: "password is not defined",
    };
  }

  if (!organisationId) {
    return {
      user: null,
      error: "organisationId is not defined",
    };
  }

  const { user, error } = await getInsertManagerGateway()({
    email,
    password: password,
    organisationId,
    type: "manager",
  });

  return { user, error };
};

export default createManager;
