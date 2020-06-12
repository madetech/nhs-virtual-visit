const createTrust = ({ getDb }) => async ({ name, adminCode, password }) => {
  const db = await getDb();

  try {
    console.log("Creating trust", name);
    const createdTrust = await db.one(
      `INSERT INTO trusts
            (id, name, admin_code, password)
            VALUES (default, $1, $2, crypt($3, gen_salt('bf', 8)))
            RETURNING id
          `,
      [name, adminCode, password]
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
