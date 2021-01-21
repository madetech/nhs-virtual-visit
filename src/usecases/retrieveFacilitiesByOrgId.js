export default ({ getRetrieveFacilitiesByOrgIdGW }) => async (
  orgId,
  options = { withWards: false }
) => {
  if (orgId == undefined) {
    return { facility: undefined, error: "organisation id must be provided" };
  }
  try {
    const { facilities, error } = await getRetrieveFacilitiesByOrgIdGW()({
      orgId,
      options,
    });
    return { facilities, error };
  } catch (error) {
    console.log(error);
    return {
      facilities: null,
      error: "There was an error retrieving facilities.",
    };
  }
};
