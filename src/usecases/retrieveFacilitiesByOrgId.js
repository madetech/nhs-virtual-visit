export default ({ getRetrieveFacilitiesByOrgIdGateway }) => async (
  orgId,
  options = { withWards: false }
) => {
  if (orgId == undefined) {
    return { facility: undefined, error: "organisation id must be provided" };
  }
  try {
    let facilities = await getRetrieveFacilitiesByOrgIdGateway()({
      orgId,
      options,
    });
    facilities = facilities.map((facility) => ({
      ...facility,
      status: facility.status === 1 ? "active" : "disabled",
    }));
    return { facilities, error: null };
  } catch (error) {
    return {
      facilities: null,
      error: "There was an error retrieving facilities.",
    };
  }
};
