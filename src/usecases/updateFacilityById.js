export default ({ getUpdateFacilityByIdGateway, logger }) => async ({ id, name }) => {
  if (id === undefined) {
    return { uuid: null, error: "id must be provided." };
  }

  if (name === undefined) {
    return { uuid: null, error: "facility name must be provided." };
  }

  try {
    logger.info(`Updating facility ${name} with ${id}`);
    const returnedUuid = await getUpdateFacilityByIdGateway()({
      id,
      name,
    });
    return { uuid: returnedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error updating the facility." };
  }
};
