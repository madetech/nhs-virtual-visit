import bcrypt from "bcryptjs";

const createTrust = ({ getCreateTrustGateway }) => async ({
  name,
  adminCode,
  password,
  videoProvider,
}) => {
  if (!password) {
    return {
      trustId: null,
      error: "password is not defined",
    };
  }

  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(password, salt);

  const { trustId, error } = await getCreateTrustGateway()({
    name,
    adminCode,
    hashedPassword,
    videoProvider,
  });

  return {
    trustId: trustId,
    error: error,
  };
};

export default createTrust;
