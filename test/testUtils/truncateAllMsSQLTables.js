export default async ({ getMsSqlConnPool }) => {
  const db = await getMsSqlConnPool();

  await db.request().query("DELETE from dbo.[scheduled_call]");
  await db.request().query("DELETE from dbo.[department]");
  await db.request().query("DELETE from dbo.[facility]");

  //these tables are circular references so we have to remove the reference first
  await db.request().query("UPDATE dbo.[organisation] SET created_by = NULL");
  await db.request().query("UPDATE dbo.[user_verification] SET user_id = NULL");

  await db.request().query("DELETE from dbo.[user]");
  await db.request().query("DELETE from dbo.[organisation]");
  await db.request().query("DELETE from dbo.[user_verification]");
};
