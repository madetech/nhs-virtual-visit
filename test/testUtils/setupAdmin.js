export default ({ getDb }) => async ({ email, password }) => {
  const db = await getDb();
  const trust = await db.one(
    `INSERT INTO admins
      (id, email, password)
      VALUES (default, $1, crypt($2, gen_salt('bf', 8)))
      RETURNING id
    `,
    [email, password]
  );
  return trust;
};
