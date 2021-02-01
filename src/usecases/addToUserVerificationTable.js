import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const addToUserVerificationTable = ({
  getAddToUserVerificationTableGateway,
}) => async ({ user_id, type }) => {
  if (!user_id) {
    return {
      verifyUser: null,
      error: "user_id is not defined",
    };
  }

  if (!type) {
    return {
      verifyUser: null,
      error: "type is not defined",
    };
  }

  const code = uuidv4();
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(code, salt);

  const { verifyUser, error } = await getAddToUserVerificationTableGateway()({
    user_id,
    code,
    hash,
    type,
  });

  return { verifyUser, error };
};

export default addToUserVerificationTable;
