import moment from "moment";

const deleteWard = ({ getRetrieveWardById, getDb }) => async (
  wardId,
  trustId
) => {
  const retrieveWardById = getRetrieveWardById();

  const retrieveResult = retrieveWardById(wardId, trustId);

  if (!retrieveResult.ward) {
    return { success: false, error: "Ward does not exist" };
  }

  const db = await getDb();

  try {
    await db.result(
      `DELETE FROM scheduled_calls_table
        WHERE
            ward_id = $1
    `,
      [wardId]
    );
  } catch (err) {
    console.error(
      `Failed to remove visits [${wardId}] from ward ${trustId}`,
      err
    );
    return { success: false, error: "Failed to remove visits" };
  }

  try {
    await db.result(
      `UPDATE wards
        SET archived_date
         $2
        WHERE id = $1
    `,
      [wardId, moment().toISOString()]
    );
  } catch (err) {
    console.error(
      `Failed to remove ward [${wardId}] from trust ${trustId}`,
      err
    );
    return { success: false, error: "Failed to remove ward" };
  }

  return { success: true, error: null };
};
export default deleteWard;
