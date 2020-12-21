import { execSync } from "child_process";
import AppContainer from "../../src/containers/AppContainer";
import { setupWardWithinHospitalAndTrust } from "../../test/testUtils/factories";
import { COMPLETE, SCHEDULED } from "../../src/helpers/visitStatus";

describe("visitor details migration", () => {
  const container = AppContainer.getInstance();
  let date;

  beforeEach(() => {
    date = new Date();
    date.setDate(date.getDate() + 1);
  });

  it("migrates the visitor details data from the visits table to the visitor_details table", async () => {
    execSync("npm run dbmigratetest reset");

    // run all migrations up until 31/10/2020 (which is just before the visitor details migration)
    execSync("npm run dbmigratetest up 20201031000000");

    const { wardId } = await setupWardWithinHospitalAndTrust();
    const db = await container.getDb();

    // inserting visits into the db
    const { id: firstVisitId, patientDetailsId } = await insertVisit(
      "Patient Name",
      "Contact Name",
      "contact@example.com",
      "07899123456",
      "TESTCALLID",
      "TESTCALLPASSWORD",
      db,
      wardId,
      date
    );
    const {
      id: secondVisitId,
      patientDetailsId: secondPatientDetailsId,
    } = await insertVisit(
      "Alice",
      "Bob",
      "bob@example.com",
      "07899456890",
      "123abc",
      "CALLP4SSWORD",
      db,
      wardId,
      date
    );

    // retrieving visits from the db
    const visits = await retrieveVisits(wardId, db);

    // checking the visits exist
    expect(visits).toEqual([
      expect.objectContaining({
        patient_details_id: patientDetailsId,
        recipient_name: "Contact Name",
        recipient_number: "07899123456",
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
        patient_details_id: secondPatientDetailsId,
        recipient_name: "Bob",
        recipient_number: "07899456890",
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

    // checking visitor_details table exists
    const [{ exists: visitorDetailsTableExists }] = await visitorDetailsTable(
      db
    );
    expect(visitorDetailsTableExists).toEqual(true);

    // checking visitor_details_id fields exists on visits table
    const [
      { exists: visitorDetailsColumnExists },
    ] = await visitorDetailsIdColumn(db);
    expect(visitorDetailsColumnExists).toEqual(true);

    // checking visitor fields no longer exist on visits table
    const [{ exists: visitorNameColumnExists }] = await visitorNameColumn(db);
    const [{ exists: visitorEmailColumnExists }] = await visitorEmailColumn(db);
    const [{ exists: visitorNumberColumnExists }] = await visitorNumberColumn(
      db
    );
    expect(visitorNameColumnExists).toEqual(false);
    expect(visitorEmailColumnExists).toEqual(false);
    expect(visitorNumberColumnExists).toEqual(false);

    // checking visitor details in new table
    const [
      { visitor_details_id: visitorDetailsId },
    ] = await retrieveVisitorDetailsId(firstVisitId, db);
    const [
      { visitor_details_id: visitorDetailsIdForSecondVisit },
    ] = await retrieveVisitorDetailsId(secondVisitId, db);

    const visitorDetails = await retrieveVisitorDetails(visitorDetailsId, db);
    expect(visitorDetails).toEqual([
      {
        id: visitorDetailsId,
        recipient_name: "Contact Name",
        recipient_email: "contact@example.com",
        recipient_number: "07899123456",
        ward_id: wardId,
      },
    ]);

    const visitorDetailsForSecondVisit = await retrieveVisitorDetails(
      visitorDetailsIdForSecondVisit,
      db
    );
    expect(visitorDetailsForSecondVisit).toEqual([
      {
        id: visitorDetailsIdForSecondVisit,
        recipient_name: "Bob",
        recipient_email: "bob@example.com",
        recipient_number: "07899456890",
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
      recipientNumber: "07899123456",
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
      recipientNumber: "07899456890",
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

  it("migrates the visitor details data from the visitor_details table to the visits table on the down migration", async () => {
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
        contactNumber: "07778123456",
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
        contactNumber: "07778789345",
        contactName: "Mae",
        callId: "TESTCALLID3",
      },
      wardId
    );

    // checking visitor details in new table
    const [
      { visitor_details_id: visitorDetailsId },
    ] = await retrieveVisitorDetailsId(id, db);

    const visitorDetails = await retrieveVisitorDetails(visitorDetailsId, db);
    expect(visitorDetails).toEqual([
      {
        id: visitorDetailsId,
        recipient_name: "Another Contact Name",
        recipient_email: "anothercontact@example.com",
        recipient_number: "07778123456",
        ward_id: wardId,
      },
    ]);

    // checking visitor details for second visit in new table
    const [
      { visitor_details_id: visitorDetailsIdForSecondVisit },
    ] = await retrieveVisitorDetailsId(secondVisitId, db);

    const visitorDetailsForSecondVisit = await retrieveVisitorDetails(
      visitorDetailsIdForSecondVisit,
      db
    );
    expect(visitorDetailsForSecondVisit).toEqual([
      {
        id: visitorDetailsIdForSecondVisit,
        recipient_name: "Mae",
        recipient_email: "mae@example.com",
        recipient_number: "07778789345",
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
      recipientNumber: "07778123456",
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
      recipientNumber: "07778789345",
      recipientEmail: "mae@example.com",
      callTime: date,
      callId: "TESTCALLID3",
      provider: "whereby",
      callPassword: "TESTCALLPASSWORD3",
      status: SCHEDULED,
      id: secondVisitId,
    });
    expect(errorForSecondVisit).toBeNull();

    // rolling back the visitor details migration
    execSync("npm run dbmigratetest down");

    const visits = await retrieveVisits(wardId, db);

    // checking visits
    const [
      { patient_details_id: patientDetailsId },
    ] = await retrievePatientDetailsId(id, db);

    const [
      { patient_details_id: patientDetailsIdForSecondVisit },
    ] = await retrievePatientDetailsId(secondVisitId, db);

    expect(visits).toEqual([
      expect.objectContaining({
        patient_details_id: patientDetailsId,
        recipient_name: "Another Contact Name",
        recipient_number: "07778123456",
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
        patient_details_id: patientDetailsIdForSecondVisit,
        recipient_name: "Mae",
        recipient_number: "07778789345",
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

    // checking visitor_details table does not exist
    const [{ exists: visitorDetailsTableExists }] = await visitorDetailsTable(
      db
    );
    expect(visitorDetailsTableExists).toEqual(false);

    // checking visitor_details_id field does not exist on visits table
    const [
      { exists: visitorDetailsColumnExists },
    ] = await visitorDetailsIdColumn(db);
    expect(visitorDetailsColumnExists).toEqual(false);

    // checking that visitor details column exists on the visits table
    const [{ exists: visitorNameColumnExists }] = await visitorNameColumn(db);
    const [{ exists: visitorEmailColumnExists }] = await visitorEmailColumn(db);
    const [{ exists: visitorNumberColumnExists }] = await visitorNumberColumn(
      db
    );
    expect(visitorNameColumnExists).toEqual(true);
    expect(visitorEmailColumnExists).toEqual(true);
    expect(visitorNumberColumnExists).toEqual(true);
  });
});

const insertVisit = async (
  patientName,
  recipientName,
  recipientEmail,
  recipientNumber,
  callId,
  callPassword,
  db,
  wardId,
  date
) => {
  const { id: patientDetailsId } = await db.one(
    `INSERT INTO patient_details
      (id, patient_name, ward_id)
      VALUES (default, $1, $2)
      RETURNING id
    `,
    [patientName, wardId]
  );

  const { id } = await db.one(
    `INSERT INTO scheduled_calls_table
        (id, recipient_email, recipient_number, recipient_name, call_time, call_id, provider, ward_id, call_password, status, patient_details_id)
        VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, call_id
      `,
    [
      recipientEmail,
      recipientNumber,
      recipientName,
      date,
      callId,
      "whereby",
      wardId,
      callPassword,
      SCHEDULED,
      patientDetailsId,
    ]
  );
  return { id, patientDetailsId };
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

const visitorDetailsIdColumn = async (db) => {
  return await db.any(
    `SELECT EXISTS
    (
      SELECT FROM information_schema.columns
      WHERE table_name = 'scheduled_calls_table'
      AND column_name = 'visitor_details_id'
    )`
  );
};

const visitorNameColumn = async (db) => {
  return await db.any(
    `SELECT EXISTS
    (
      SELECT FROM information_schema.columns
      WHERE table_name = 'scheduled_calls_table'
      AND column_name = 'recipient_name'
    )`
  );
};

const visitorEmailColumn = async (db) => {
  return await db.any(
    `SELECT EXISTS
    (
      SELECT FROM information_schema.columns
      WHERE table_name = 'scheduled_calls_table'
      AND column_name = 'recipient_email'
    )`
  );
};

const visitorNumberColumn = async (db) => {
  return await db.any(
    `SELECT EXISTS
    (
      SELECT FROM information_schema.columns
      WHERE table_name = 'scheduled_calls_table'
      AND column_name = 'recipient_number'
    )`
  );
};

const visitorDetailsTable = async (db) => {
  return await db.any(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'visitor_details')"
  );
};

const retrieveVisitorDetailsId = async (visitId, db) => {
  return await db.any(
    "SELECT visitor_details_id FROM scheduled_calls_table WHERE id = $1",
    [visitId]
  );
};

const retrieveVisitorDetails = async (visitorDetailsId, db) => {
  return await db.any("SELECT * FROM visitor_details WHERE id = $1", [
    visitorDetailsId,
  ]);
};

const retrievePatientDetailsId = async (visitId, db) => {
  return await db.any(
    "SELECT patient_details_id FROM scheduled_calls_table WHERE id = $1",
    [visitId]
  );
};
