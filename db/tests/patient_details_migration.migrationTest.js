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
    execSync("npm run dbmigratetest reset");

    // run all migrations up until 24/07/2020 (which is just before the patient details migration)
    execSync("npm run dbmigratetest up 20200724000000");

    const { wardId } = await setupWardWithinHospitalAndTrust();
    const db = await container.getDb();

    // inserting visits into the db
    const { id: firstVisitId } = await insertVisit(
      "Patient Name",
      "Contact Name",
      "contact@example.com",
      "TESTCALLID",
      "TESTCALLPASSWORD",
      db,
      wardId,
      date
    );
    const { id: secondVisitId } = await insertVisit(
      "Alice",
      "Bob",
      "bob@example.com",
      "123abc",
      "CALLP4SSWORD",
      db,
      wardId,
      date
    );

    // retrieving visits from the db
    const visits = await retrieveVisits(wardId, db);

    // checking the visits exists before the patient details migration is run
    expect(visits).toEqual([
      expect.objectContaining({
        patient_name: "Patient Name",
        recipient_name: "Contact Name",
        recipient_number: null,
        recipient_email: "contact@example.com",
        call_time: date,
        call_id: "TESTCALLID",
        provider: "whereby",
        call_password: "TESTCALLPASSWORD",
        status: SCHEDULED,
        id: firstVisitId,
        pii_cleared_at: null,
        ward_id: wardId,
      }),
      expect.objectContaining({
        patient_name: "Alice",
        recipient_name: "Bob",
        recipient_number: null,
        recipient_email: "bob@example.com",
        call_time: date,
        call_id: "123abc",
        provider: "whereby",
        call_password: "CALLP4SSWORD",
        status: SCHEDULED,
        id: secondVisitId,
        pii_cleared_at: null,
        ward_id: wardId,
      }),
    ]);

    // running the rest of the migrations
    execSync("npm run dbmigratetest up");

    // checking patient_details table exists
    const [{ exists: patientDetailsTableExists }] = await patientDetailsTable(
      db
    );
    expect(patientDetailsTableExists).toEqual(true);

    // checking patient_details_id fields exists on visits table
    const [
      { exists: patientDetailsColumnExists },
    ] = await patientDetailsIdColumn(db);
    expect(patientDetailsColumnExists).toEqual(true);

    // checking patient_name field no longer exist on visits table
    const [{ exists: patientNameColumnExists }] = await patientNameColumn(db);
    expect(patientNameColumnExists).toEqual(false);

    // checking patient details in new table
    const [
      { patient_details_id: patientDetailsId },
    ] = await retrievePatientDetailsId(firstVisitId, db);
    const [
      { patient_details_id: patientDetailsIdForSecondVisit },
    ] = await retrievePatientDetailsId(secondVisitId, db);

    const patientDetails = await retrievePatientDetails(patientDetailsId, db);
    expect(patientDetails).toEqual([
      {
        id: patientDetailsId,
        patient_name: "Patient Name",
        ward_id: wardId,
      },
    ]);

    const patientDetailsForSecondVisit = await retrievePatientDetails(
      patientDetailsIdForSecondVisit,
      db
    );
    expect(patientDetailsForSecondVisit).toEqual([
      {
        id: patientDetailsIdForSecondVisit,
        patient_name: "Alice",
        ward_id: wardId,
      },
    ]);

    const { scheduledCall, error } = await container.getRetrieveVisitById()({
      id: firstVisitId,
      wardId,
    });

    // checking first visit
    expect(scheduledCall).toEqual({
      patientName: "Patient Name",
      recipientName: "Contact Name",
      recipientNumber: null,
      recipientEmail: "contact@example.com",
      callTime: date,
      callId: "TESTCALLID",
      provider: "whereby",
      callPassword: "TESTCALLPASSWORD",
      status: SCHEDULED,
      id: firstVisitId,
    });
    expect(error).toBeNull();

    const {
      scheduledCall: secondVisit,
      error: errorForSecondVisit,
    } = await container.getRetrieveVisitById()({
      id: secondVisitId,
      wardId,
    });

    // checking second visit
    expect(secondVisit).toEqual({
      patientName: "Alice",
      recipientName: "Bob",
      recipientNumber: null,
      recipientEmail: "bob@example.com",
      callTime: date,
      callId: "123abc",
      provider: "whereby",
      callPassword: "CALLP4SSWORD",
      status: SCHEDULED,
      id: secondVisitId,
    });
    expect(errorForSecondVisit).toBeNull();
  });

  it("migrates the patient details data from the patient_details table to the visits table on the down migration", async () => {
    execSync("npm run dbmigratetest reset");

    // run all migrations up until 06/11/2020 (just after the visitor details migration)
    execSync("npm run dbmigratetest up 20201106000000");

    const { wardId } = await setupWardWithinHospitalAndTrust();
    const db = await container.getDb();

    // adding visit to db
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

    // adding a second visit to db
    const { id: secondVisitId } = await container.getInsertVisitGateway()(
      db,
      {
        provider: "whereby",
        callPassword: "TESTCALLPASSWORD3",
        patientName: "Mary",
        callTime: date,
        contactEmail: "mae@example.com",
        contactName: "Mae",
        callId: "TESTCALLID3",
      },
      wardId
    );

    // checking patient details in new table
    const [
      { patient_details_id: patientDetailsId },
    ] = await retrievePatientDetailsId(id, db);

    const patientDetails = await retrievePatientDetails(patientDetailsId, db);
    expect(patientDetails).toEqual([
      {
        id: patientDetailsId,
        patient_name: "Another Patient Name",
        ward_id: wardId,
      },
    ]);

    // checking patient details for second visit in new table
    const [
      { patient_details_id: patientDetailsIdForSecondVisit },
    ] = await retrievePatientDetailsId(secondVisitId, db);

    const patientDetailsForSecondVisit = await retrievePatientDetails(
      patientDetailsIdForSecondVisit,
      db
    );
    expect(patientDetailsForSecondVisit).toEqual([
      {
        id: patientDetailsIdForSecondVisit,
        patient_name: "Mary",
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
      recipientNumber: null,
      recipientEmail: "anothercontact@example.com",
      callTime: date,
      callId: "TESTCALLID2",
      provider: "whereby",
      callPassword: "TESTCALLPASSWORD2",
      status: SCHEDULED,
      id,
    });
    expect(error).toBeNull();

    let {
      scheduledCall: secondVisit,
      error: errorForSecondVisit,
    } = await container.getRetrieveVisitById()({
      id: secondVisitId,
      wardId,
    });

    // checking second visit
    expect(secondVisit).toEqual({
      patientName: "Mary",
      recipientName: "Mae",
      recipientNumber: null,
      recipientEmail: "mae@example.com",
      callTime: date,
      callId: "TESTCALLID3",
      provider: "whereby",
      callPassword: "TESTCALLPASSWORD3",
      status: SCHEDULED,
      id: secondVisitId,
    });
    expect(errorForSecondVisit).toBeNull();

    // rolling back the visitor details + patient details migration
    execSync("npm run dbmigratetest down");
    execSync("npm run dbmigratetest down");

    const visits = await retrieveVisits(wardId, db);

    // checking visits
    expect(visits).toEqual([
      expect.objectContaining({
        patient_name: "Another Patient Name",
        recipient_name: "Another Contact Name",
        recipient_number: null,
        recipient_email: "anothercontact@example.com",
        call_time: date,
        call_id: "TESTCALLID2",
        provider: "whereby",
        call_password: "TESTCALLPASSWORD2",
        status: SCHEDULED,
        id,
        pii_cleared_at: null,
        ward_id: wardId,
      }),
      expect.objectContaining({
        patient_name: "Mary",
        recipient_name: "Mae",
        recipient_number: null,
        recipient_email: "mae@example.com",
        call_time: date,
        call_id: "TESTCALLID3",
        provider: "whereby",
        call_password: "TESTCALLPASSWORD3",
        status: SCHEDULED,
        id: secondVisitId,
        pii_cleared_at: null,
        ward_id: wardId,
      }),
    ]);

    // checking patient_details table does not exist
    const [{ exists: patientDetailsTableExists }] = await patientDetailsTable(
      db
    );
    expect(patientDetailsTableExists).toEqual(false);

    // checking patient_details_id field does not exist on visits table
    const [
      { exists: patientDetailsColumnExists },
    ] = await patientDetailsIdColumn(db);
    expect(patientDetailsColumnExists).toEqual(false);

    // checking that patient name column exists on the visits table
    const [{ exists: patientNameColumnExists }] = await patientNameColumn(db);
    expect(patientNameColumnExists).toEqual(true);
  });
});

const insertVisit = async (
  patientName,
  recipientName,
  recipientEmail,
  callId,
  callPassword,
  db,
  wardId,
  date
) => {
  const { id } = await db.one(
    `INSERT INTO scheduled_calls_table
        (id, patient_name, recipient_email, recipient_number, recipient_name, call_time, call_id, provider, ward_id, call_password, status)
        VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, call_id
      `,
    [
      patientName,
      recipientEmail,
      null,
      recipientName,
      date,
      callId,
      "whereby",
      wardId,
      callPassword,
      SCHEDULED,
    ]
  );
  return { id };
};

const retrieveVisits = async (wardId, db) => {
  return await db.any(
    `SELECT * FROM scheduled_calls_table
    WHERE ward_id = $1
    AND status = ANY(ARRAY[$2,$3]::text[])
    AND pii_cleared_at IS NULL
    `,
    [wardId, SCHEDULED, COMPLETE]
  );
};

const patientDetailsIdColumn = async (db) => {
  return await db.any(
    `SELECT EXISTS
    (
      SELECT FROM information_schema.columns
      WHERE table_name = 'scheduled_calls_table'
      AND column_name = 'patient_details_id'
    )`
  );
};

const patientNameColumn = async (db) => {
  return await db.any(
    `SELECT EXISTS
    (
      SELECT FROM information_schema.columns
      WHERE table_name = 'scheduled_calls_table'
      AND column_name = 'patient_name'
    )`
  );
};

const patientDetailsTable = async (db) => {
  return await db.any(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'patient_details')"
  );
};

const retrievePatientDetailsId = async (visitId, db) => {
  return await db.any(
    "SELECT patient_details_id FROM scheduled_calls_table WHERE id = $1",
    [visitId]
  );
};

const retrievePatientDetails = async (patientDetailsId, db) => {
  return await db.any("SELECT * FROM patient_details WHERE id = $1", [
    patientDetailsId,
  ]);
};
