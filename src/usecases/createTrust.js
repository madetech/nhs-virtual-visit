import bcrypt from "bcryptjs";

const createTrust = ({ getDb }) => async ({
  name,
  adminCode,
  password,
  videoProvider,
}) => {
  const db = await getDb();

  if (!password) {
    return {
      trustId: null,
      error: "password is not defined",
    };
  }

  try {
    console.log("Creating trust", name);

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    const createdTrust = await db.one(
      `INSERT INTO trusts
            (id, name, admin_code, password, video_provider)
            VALUES (default, $1, $2, $3, $4)
            RETURNING id
          `,
      [name, adminCode, hashedPassword, videoProvider]
    );

    return {
      trustId: createdTrust.id,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      trustId: null,
      error: error.toString(),
    };
  }
};

export default createTrust;
