const retrieveTrustById = ({ getDb }) => async (trustId) => {
  const db = await getDb();
  console.log("Retrieving trust for  ", trustId);
  try {
    const trust = await db.oneOrNone(
      "SELECT * FROM trusts WHERE id = $1 LIMIT 1",
      trustId
    );

    return {
      trust: {
        id: trust.id,
        name: trust.name,
      },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      trust: null,
      error: error.toString(),
    };
  }
};

export default retrieveTrustById;
