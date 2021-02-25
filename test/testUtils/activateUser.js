import { statusToId, ACTIVE } from "../../src/helpers/statusTypes";

export default ({ getMsSqlConnPool }) => async ({
  userId,
}) => {
  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("userId", userId)
      .input("status", statusToId(ACTIVE))
      .query(
        `UPDATE dbo.[user] SET status = @status 
          OUTPUT inserted.*
          WHERE id = @userId`
      );
    const activeUser = response.recordset[0]; 
    return activeUser;
  } catch (error) {
    console.log(`Error activating user for contract tests: ${error}`);
  }
}