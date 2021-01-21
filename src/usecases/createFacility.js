import logger from "../../logger";

export default ({ getCreateFacilityGateway }) => async ({
  name,
  orgId,
  code,
  createdBy,
}) => {
  if (orgId == undefined) {
    return {
      facilityId: undefined,
      error: "organisation id must be provided.",
    };
  }
  if (name == undefined) {
    return { facilityId: undefined, error: "name must be provided." };
  }
  if (code == undefined) {
    return { facilityId: undefined, error: "facility code must be provided." };
  }
  try {
    logger.info({
      message: `Creating facility for ${name}, trust: ${orgId}`,
      meta: { name, code, orgId },
    });
    const facilityId = await getCreateFacilityGateway()({
      name,
      orgId,
      code,
      createdBy,
    });
    return { facilityId, error: null };
  } catch (error) {
    logger.error(`Error creating facility ${name}, ${error}`);
    return {
      facilityId: null,
      error: "There was an error creating a facility.",
    };
  }
};
