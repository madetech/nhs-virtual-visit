import logger from "../../../logger";

const updateTrust = ({ getDb }) => async ({ id, videoProvider }) => {
  logger.info(`Updating trust ${id}`);

  try {
    const updatedTrust = await getDb().oneOrNone(
      `UPDATE trusts
       SET video_provider = $1
       WHERE id = $2
       RETURNING id
      `,
      [videoProvider, id]
    );

    if (updatedTrust) {
      return {
        id: updatedTrust.id,
        error: null,
      };
    } else {
      return {
        id: null,
        error: null,
      };
    }
  } catch (error) {
    logger.error(`Error updating trust ${error}`);

    return {
      id: null,
      error: error.toString(),
    };
  }
};

export default updateTrust;
