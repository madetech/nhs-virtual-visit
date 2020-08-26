import logger from "../../logger";

const retrieveTrusts = ({ getDb }) => async () => {
  const db = await getDb();
  try {
    const trusts = await db.any(
      `SELECT
        id as id,
        name as name,
        admin_code as admin_code,
        video_provider
      FROM
        trusts`
    );

    return {
      trusts: trusts.map((trust) => ({
        id: trust.id,
        name: trust.name,
        adminCode: trust.admin_code,
        videoProvider: trust.video_provider,
      })),
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      trusts: null,
      error: error.toString(),
    };
  }
};

export default retrieveTrusts;
