const retrieveManagersByOrgId = ({
  getRetrieveManagersByOrgIdGateway,
}) => async (orgId) => {
  if (!orgId) {
    return {
      managers: null,
      error: "orgId is not defined",
    };
  }

  const { managers, error } = await getRetrieveManagersByOrgIdGateway()(orgId);

  let managersArr = [];

  if (managers) {
    managersArr = managers.map((manager) => ({
      ...manager,
      status: manager.status === 1 ? "active" : "disabled",
    }));
  }

  return {
    managers: managersArr,
    error: error,
  };
};

export default retrieveManagersByOrgId;
