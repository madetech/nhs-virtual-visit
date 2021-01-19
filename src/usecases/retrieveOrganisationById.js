import logger from "../../logger";

const retrieveOrganisationById = ({
  getRetrieveOrganisationByIdGateway,
}) => async (organisationId) => {
  try {
    const organisation = await getRetrieveOrganisationByIdGateway()(
      organisationId
    );
    const organisationObj = { name: organisation.name };
    return {
      organisation: organisationObj,
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

export default retrieveOrganisationById;
