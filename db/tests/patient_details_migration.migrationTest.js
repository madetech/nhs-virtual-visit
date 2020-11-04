import { execSync } from "child_process";
import AppContainer from "../../src/containers/AppContainer";
import { setupWardWithinHospitalAndTrust } from "../../src/testUtils/factories";
import { COMPLETE, SCHEDULED } from "../../src/helpers/visitStatus";

describe("patient details migration", () => {
  const container = AppContainer.getInstance();
  let date;

  beforeEach(() => {
    date = new Date();
    date.setDate(date.getDate() + 1);
  });

  it("migrates the patient details data from the visits table to the patient_details table", async () => {
    const downAllMigrations = execSync("npm run dbmigratetest reset");
    console.log(downAllMigrations.toString());

    // run all migrations up until 24/07/2020 (which is just before the Patient Details migration)
    const runMigrationsToBeforePatientDetailsMigration = execSync(
      "npm run dbmigratetest up 20200724000000"
    );
    console.log(runMigrationsToBeforePatientDetailsMigration.toString());

    const { wardId } = await setupWardWithinHospitalAndTrust();

    const db = await container.getDb();

    const { id } = await db.one(
      `INSERT INTO scheduled_calls_table
        (id, patient_name, recipient_email, recipient_number, recipient_name, call_time, call_id, provider, ward_id, call_password, status)
        VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, call_id
      `,
      [
        "Patient Name",
        "contact@example.com",
        "",
        "Contact Name",
        date,
        "TESTCALLID",
        "whereby",
        wardId,
        "TESTCALLPASSWORD",
        SCHEDULED,
      ]
    );

    const visit = await db.one(
      `SELECT * FROM scheduled_calls_table
      WHERE ward_id = $1
      AND status = ANY(ARRAY[$2,$3]::text[])
      AND pii_cleared_at IS NULL
      `,
      [id, wardId, SCHEDULED, COMPLETE]
    );

    // checking that, before the Patient Details migration is run, the visit contains the patient name
    expect(visit).toEqual({
      patient_name: "Patient Name",
      recipient_name: "Contact Name",
      recipient_number: "",
      recipient_email: "contact@example.com",
      call_time: date,
      call_id: "TESTCALLID",
      provider: "whereby",
      call_password: "TESTCALLPASSWORD",
      status: SCHEDULED,
      id,
      pii_cleared_at: null,
      ward_id: wardId,
    });

    // running patient_details migration
    execSync("npm run dbmigratetest up");

    // checking patient_details table exists
    const [{ exists: patientDetailsTableExists }] = await db.any(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'patient_details')"
    );
    expect(patientDetailsTableExists).toEqual(true);

    // checking patient_details_id fields exists on visits table
    const [{ exists: patientDetailsColumnExists }] = await db.any(
      `SELECT EXISTS
      (
        SELECT FROM information_schema.columns
        WHERE table_name = 'scheduled_calls_table'
        AND column_name = 'patient_details_id'
      )`
    );
    expect(patientDetailsColumnExists).toEqual(true);

    // checking patient_name field no longer exist on visits table
    const [{ exists: patientNameColumnExists }] = await db.any(
      `SELECT EXISTS
      (
        SELECT FROM information_schema.columns
        WHERE table_name = 'scheduled_calls_table'
        AND column_name = 'patient_name'
      )`
    );
    expect(patientNameColumnExists).toEqual(false);

    // checking patient details in new table
    const [
      { patient_details_id: patientDetailsId },
    ] = await db.any(
      "SELECT patient_details_id FROM scheduled_calls_table WHERE id = $1",
      [id]
    );

    const patientDetails = await db.any(
      "SELECT * FROM patient_details WHERE id = $1",
      [patientDetailsId]
    );
    expect(patientDetails).toEqual([
      {
        id: patientDetailsId,
        patient_name: "incorrect name",
        ward_id: wardId,
      },
    ]);

    const { scheduledCall, error } = await container.getRetrieveVisitById()({
      id,
      wardId,
    });

    // checking visit is still there
    expect(scheduledCall).toEqual({
      patientName: "Patient Name",
      recipientName: "Contact Name",
      recipientNumber: "",
      recipientEmail: "contact@example.com",
      callTime: date,
      callId: "TESTCALLID",
      provider: "whereby",
      callPassword: "TESTCALLPASSWORD",
      status: SCHEDULED,
      id,
    });
    expect(error).toBeNull();
  });

  it("migrates the patient details data from the patient_details table to the visits table on the down migration", async () => {
    const downAllMigrations = execSync("npm run dbmigratetest reset");
    console.log(downAllMigrations.toString());

    // run all migrations up until 31/10/2020 (which is just after the Patient Details migration)
    const runMigrationsToJustAfterPatientDetailsMigration = execSync(
      "npm run dbmigratetest up 20201031000000"
    );
    console.log(runMigrationsToJustAfterPatientDetailsMigration.toString());

    const { wardId } = await setupWardWithinHospitalAndTrust();

    const db = await container.getDb();

    const { id } = await container.getInsertVisitGateway()(
      db,
      {
        provider: "whereby",
        callPassword: "TESTCALLPASSWORD2",
        patientName: "Another Patient Name",
        callTime: date,
        contactEmail: "anothercontact@example.com",
        contactName: "Another Contact Name",
        callId: "TESTCALLID2",
      },
      wardId
    );

    // checking patient details in new table
    const [
      { patient_details_id: patientDetailsId },
    ] = await db.any(
      "SELECT patient_details_id FROM scheduled_calls_table WHERE id = $1",
      [id]
    );

    const patientDetails = await db.any(
      "SELECT * FROM patient_details WHERE id = $1",
      [patientDetailsId]
    );
    expect(patientDetails).toEqual([
      {
        id: patientDetailsId,
        patient_name: "Another Patient Name",
        ward_id: wardId,
      },
    ]);

    let { scheduledCall, error } = await container.getRetrieveVisitById()({
      id,
      wardId,
    });

    // checking visit
    expect(scheduledCall).toEqual({
      patientName: "Another Patient Name",
      recipientName: "Another Contact Name",
      recipientNumber: "",
      recipientEmail: "anothercontact@example.com",
      callTime: date,
      callId: "TESTCALLID2",
      provider: "whereby",
      callPassword: "TESTCALLPASSWORD2",
      status: SCHEDULED,
      id,
    });
    expect(error).toBeNull();

    // rolling back the patient_details migration
    execSync("npm run dbmigratetest down");

    const visit = await db.one(
      `SELECT * FROM scheduled_calls_table
      WHERE ward_id = $1
      AND status = ANY(ARRAY[$2,$3]::text[])
      AND pii_cleared_at IS NULL
      `,
      [id, wardId, SCHEDULED, COMPLETE]
    );

    // checking that the visit is there
    expect(visit).toEqual({
      patient_name: "",
      recipient_name: "Another Contact Name",
      recipient_number: "",
      recipient_email: "anothercontact@example.com",
      call_time: date,
      call_id: "TESTCALLID2",
      provider: "whereby",
      call_password: "TESTCALLPASSWORD2",
      status: SCHEDULED,
      id,
      pii_cleared_at: null,
      ward_id: wardId,
    });

    // checking patient_details table does not exist
    const [{ exists: patientDetailsTableExists }] = await db.any(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'patient_details')"
    );
    expect(patientDetailsTableExists).toEqual(false);

    // checking patient_details_id field does not exist on visits table
    const [{ exists: patientDetailsColumnExists }] = await db.any(
      `SELECT EXISTS
      (
        SELECT FROM information_schema.columns
        WHERE table_name = 'scheduled_calls_table'
        AND column_name = 'patient_details_id'
      )`
    );
    expect(patientDetailsColumnExists).toEqual(false);

    // check that patient name column exisits on the visits table
    const [{ exists: patientNameColumnExists }] = await db.any(
      `SELECT EXISTS
      (
        SELECT FROM information_schema.columns
        WHERE table_name = 'scheduled_calls_table'
        AND column_name = 'patient_name'
      )`
    );
    expect(patientNameColumnExists).toEqual(true);
  });
});
