import { insertVisit } from "./createVisit";
import { SCHEDULED } from "../../src/helpers/visitStatus";

describe("insertVisit sql test", () => {
  it("creates a visit in the db when valid", async () => {
    const oneSpy = jest.fn().mockResolvedValue({ id: 10, call_id: "12345" });
    const db = {
      one: oneSpy,
    };

    const request = {
      patientName: "Bob Smith",
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: "12345",
      provider: "jitsi",
      wardId: 1,
      callPassword: "securePassword",
    };
    const wardId = "wardId";
    const { id, callId } = await insertVisit(db, request, wardId);

    expect(id).toEqual(10);
    expect(callId).toEqual("12345");

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.patientName,
      request.contactEmail,
      request.contactNumber,
      request.contactName,
      request.callTime,
      request.callId,
      request.provider,
      wardId,
      request.callPassword,
      SCHEDULED,
    ]);
  });
});
