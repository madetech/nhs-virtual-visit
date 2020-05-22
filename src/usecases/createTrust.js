const createTrust = ({ getDb }) => async ({ name, adminCode }) => {
  const db = await getDb();

  try {
    console.log("Creating trust", name);
    const createdTrust = await db.one(
      `INSERT INTO trusts
            (id, name, admin_code)
            VALUES (default, $1, $2)
            RETURNING id
          `,
      [name, adminCode]
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
