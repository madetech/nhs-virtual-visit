import { CANCELLED } from "../../src/helpers/visitStatus";

const deleteVisitByCallId = ({ getDb }) => async (callId) => {
  const db = await getDb();
  console.log("deleting visit for  ", callId);
  try {
    const results = await db.any(
      `UPDATE scheduled_calls_table SET status = $1 WHERE call_id = $2`,
      [CANCELLED, callId]
    );
    console.log(results, "success=true");
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.toString(),
    };
  }
};

export default deleteVisitByCallId;
