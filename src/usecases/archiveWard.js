import moment from "moment";
import { ARCHIVED } from "../../src/helpers/visitStatus";
import logger from "../../logger";

const archiveWard = ({
  getRetrieveWardById,
  getUpdateWardArchiveTimeByIdGateway,
  getUpdateCallStatusesByWardIdGateway,
}) => async (wardId, trustId) => {
  const retrieveWardById = getRetrieveWardById();
  const updateCallStatusesByWardIdGateway = getUpdateCallStatusesByWardIdGateway();
  const updateWardArchiveTimeByIdGateway = getUpdateWardArchiveTimeByIdGateway();

  const retrieveResult = await retrieveWardById(wardId, trustId);

  if (!retrieveResult.ward) {
    return { success: false, error: "Ward does not exist" };
  }

  try {
    await updateCallStatusesByWardIdGateway(wardId, ARCHIVED);
  } catch (err) {
    logger.error(
      `Failed to remove visits [${wardId}] from ward ${trustId}`,
      err
    );
    return { success: false, error: "Failed to remove visits" };
  }

  try {
    await updateWardArchiveTimeByIdGateway(wardId, moment().toISOString());
  } catch (err) {
    logger.error(
      `Failed to remove ward [${wardId}] from trust ${trustId}`,
      err
    );
    return { success: false, error: "Failed to remove ward" };
  }

  return { success: true, error: null };
};

export default archiveWard;
