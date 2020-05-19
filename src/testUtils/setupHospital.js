export default ({ getDb }) => async ({ name, trustId }) => {
  const db = await getDb();
  const hospital = await db.one(
    `INSERT INTO hospitals
      (id, name, trust_id)
      VALUES (default, $1, $2)
      RETURNING id
    `,
    [name, trustId]
  );
  return hospital;
};
