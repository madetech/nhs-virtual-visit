export default ({ getDb }) => async ({ name, adminCode, password }) => {
  const db = await getDb();
  const trust = await db.one(
    `INSERT INTO trusts
      (id, name, admin_code, password)
      VALUES (default, $1, $2, crypt($3, gen_salt('bf', 8)))
      RETURNING id
    `,
    [name, adminCode, password]
  );
  return trust;
};
