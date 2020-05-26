const createRefreshToken = ({ getDb }) => async ({ refreshToken }) => {
  const db = await getDb();

  try {
    const createdRefreshToken = await db.one(
      `INSERT INTO refresh_tokens
            (id, value)
            VALUES (default, $1)
            RETURNING id
          `,
      [refreshToken]
    );

    return {
      refreshTokenId: createdRefreshToken.id,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      refreshTokenId: null,
      error: error.toString(),
    };
  }
};

export default createRefreshToken;
