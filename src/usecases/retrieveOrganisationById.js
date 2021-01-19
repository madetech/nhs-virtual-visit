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
      organisation: null,
      error: "There is an error with the database",
    };
  }
};

export default retrieveOrganisationById;
