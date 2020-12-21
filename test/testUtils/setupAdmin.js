export default ({ getDb }) => async ({ code, password }) => {
  const db = await getDb();
  const trust = await db.one(
    `INSERT INTO admins
      (id, code, password)
      VALUES (default, $1, crypt($2, gen_salt('bf', 8)))
      RETURNING id
    `,
    [code, password]
  );
  return trust;
};
