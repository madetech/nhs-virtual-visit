import logger from "../../logger";

const retrieveManagersByOrgId = ({
  getRetrieveManagersByOrgIdGateway,
}) => async (orgId) => {
  if (orgId === undefined) {
    return { managers: null, error: "orgId is must be provided." };
  }
  try {
    logger.info(`Retrieving managers for ${orgId}`);

    let managers = await getRetrieveManagersByOrgIdGateway()(orgId);
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
