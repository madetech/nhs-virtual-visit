export default ({ getRetrieveFacilitiesByOrgIdGateway }) => async (
  orgId,
  options = { withWards: false }
) => {
  if (orgId == undefined) {
    return { facility: undefined, error: "organisation id must be provided" };
  }
  try {
    const facilities = await getRetrieveFacilitiesByOrgIdGateway()({
      orgId,
      options,
    });
    return { facilities, error: null };
  } catch (error) {
    return {
      facilities: null,
      error: "There was an error retrieving facilities.",
    };
  }
};
