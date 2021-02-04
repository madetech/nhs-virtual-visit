import { idToStatus } from "../helpers/statusTypes";
export default ({ getRetrieveActiveManagersByOrgIdGateway }) => async (
  orgId
) => {
  if (!orgId) {
    return {
      managers: null,
      error: "orgId is not defined",
    };
  }

  const { managers, error } = await getRetrieveActiveManagersByOrgIdGateway()(
    orgId
  );

  let managersArr = [];

  if (managers) {
    managersArr = managers.map((manager) => ({
      ...manager,
      status: idToStatus(manager.status),
    }));
  }

  return {
    managers: managersArr,
    error: error,
  };
};
