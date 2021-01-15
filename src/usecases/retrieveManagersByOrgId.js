import logger from "../../logger";

const retrieveManagersByOrgId = ({
  getMsSqlConnPool,
  getRetrieveManagersByOrgIdGateway,
}) => async (orgId) => {
  try {
    logger.info(`Retrieving managers for ${orgId}`);
    const db = await getMsSqlConnPool();
    let managers = await getRetrieveManagersByOrgIdGateway()(db, orgId);
    managers = managers.map((row) => ({
      uuid: row.uuid,
      email: row.email,
      status: row.status == 1 ? "active" : "disabled",
    }));
    return { managers, error: null };
  } catch (error) {
    return { managers: null, error: "There was an error retrieving managers." };
  }
};

export default retrieveManagersByOrgId;
