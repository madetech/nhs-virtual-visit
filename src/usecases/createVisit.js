import validateVisit from "../../src/helpers/validateVisit";
import logger from "../../logger";

const createVisit = (createVisitUnitOfWork) => async (
  visit,
  ward,
  callId,
  callPassword,
  videoProvider
) => {
  const { validVisit, errors } = validateVisit(visit);

  if (!validVisit) {
    logger.error("invalid visit on create", { visit, errors });
    return { success: false, err: errors };
  }

  const populatedVisit = Object.assign({}, visit, {
    callId,
    callPassword,
    provider: videoProvider,
  });

  try {
    const { success, error } = await createVisitUnitOfWork(
      populatedVisit,
      ward
    );

    if (!success) {
      return { success: false, err: error };
    }

    return { success: true, err: undefined };
  } catch (err) {
    logger.error("failed to create visit", err);
    return { success: false, err: err };
  }
};

export default createVisit;
