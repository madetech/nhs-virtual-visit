const addToUserVerificationTable = ({
  getAddToUserVerificationTableGateway,
}) => async ({ user_id, code, hash, type }) => {
  try {
    await getAddToUserVerificationTableGateway()(user_id, code, hash, type);
    return { error: null };
  } catch (err) {
    console.log(err);
    return {
      error: "There was an error creating entry in user verification table.",
    };
  }
};

export default addToUserVerificationTable;
