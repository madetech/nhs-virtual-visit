const createManager = ({ getInsertManagerGateway }) => async ({
  email,
  password,
  organisationId,
  type,
}) => {
  try {
    const user = await getInsertManagerGateway()(
      email,
      password,
      organisationId,
      type
    );
    return { user, error: null };
  } catch (error) {
    return { user: null, error: "There was an error creating a manager." };
  }
};

export default createManager;
