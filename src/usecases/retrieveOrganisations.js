import logger from "../../logger";

const retrieveOrganisations = ({
  getRetrieveOrganisationsGateway,
}) => async () => {
  try {
    const organisations = await getRetrieveOrganisationsGateway()();

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
