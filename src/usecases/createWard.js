const createWard = ({ getDb }) => async (ward) => {
  const db = await getDb();

  console.log("Creating ward for ", ward);
  return await db.one(
    `INSERT INTO wards
      (id, name, hospital_name)
      VALUES (default, $1, $2)
      RETURNING id
    `,
    [ward.name, ward.hospitalName]
  );
};

export default createWard;
