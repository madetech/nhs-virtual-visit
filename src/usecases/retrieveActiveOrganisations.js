import logger from "../../logger";

const retrieveOrganisations = ({
  getMsSqlConnPool,
  getRetrieveActiveOrganisationsGateway,
}) => async () => {
  try {
    const db = await getMsSqlConnPool();
    const organisations = await getRetrieveActiveOrganisationsGateway()(db);

    return {
      organisations: organisations.map((organisation) => ({
        id: organisation.id,
        name: organisation.name,
        status: organisation.status,
      })),
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      organisations: null,
      error: "There is an error with the database",
    };
  }
};

export default retrieveOrganisations;
