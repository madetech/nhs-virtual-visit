const updateTrust = ({ getDb }) => async ({ id, videoProvider }) => {
  const db = await getDb();

  try {
    const updatedTrust = await db.one(
      `UPDATE trusts
      SET video_provider = $1
      WHERE
        id = $2
      RETURNING id
      `,
      [videoProvider, id]
    );

    return {
      id: updatedTrust.id,
      error: null,
    };
  } catch (error) {
    console.error(error);

    return {
      id: null,
      error: error.toString(),
    };
  }
};

export default updateTrust;
