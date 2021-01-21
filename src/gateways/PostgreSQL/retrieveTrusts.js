export default ({ getDb }) => async () => {
  const db = await getDb();

  const trusts = await db.any(
    `SELECT
        id as id,
        name as name,
        admin_code as admin_code,
        video_provider
      FROM
        trusts`
  );

  return trusts.map((trust) => ({
    id: trust.id,
    name: trust.name,
    adminCode: trust.admin_code,
    videoProvider: trust.video_provider,
  }));
};
