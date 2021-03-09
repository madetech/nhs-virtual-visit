export default ({ getCreateFacilityGateway, logger }) => async ({
  name,
  orgId,
  code,
  createdBy,
}) => {
  if (orgId == undefined) {
    return {
      uuid: undefined,
      error: "organisation id must be provided.",
    };
  }
  if (name == undefined) {
    return { uuid: undefined, error: "name must be provided." };
  }
  if (code == undefined) {
    return { uuid: undefined, error: "facility code must be provided." };
  }
  try {
    logger.info({
      message: `Creating facility for ${name}, trust: ${orgId}`,
      meta: { name, code, orgId },
    });
    const uuid = await getCreateFacilityGateway()({
      name,
      orgId,
      code,
      createdBy,
    });
    return { uuid, error: null };
  } catch (error) {
    logger.error(`Error creating facility ${name}, ${error}`);
    return {
      uuid: null,
      error: "There was an error creating a facility.",
    };
  }
};
