export default ({ getDb }) => async ({ name, admin_code }) => {
  const db = await getDb();
  const trust = await db.one(
    `INSERT INTO trusts
      (id, name, admin_code)
      VALUES (default, $1, $2)
      RETURNING id
    `,
    [name, admin_code]
  );
  return trust;
};
