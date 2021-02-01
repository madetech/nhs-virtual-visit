import bcrypt from "bcryptjs";

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

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const { user, error } = await getInsertManagerGateway()({
    email,
    password: hashedPassword,
    organisationId,
    type: "manager",
  });

  return { user, error };
};

export default createManager;
